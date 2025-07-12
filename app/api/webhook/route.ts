import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { createUser, deleteUser, updateUser } from "@/lib/actions/user.action";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
  const WEBHOOK_SECRET = process.env.NEXT_CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local",
    );
  }

  // Get the headers
  const headerPayload = headers();
  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  // Get the ID and type
  const eventType = evt.type;

  console.log("Webhook event type:", eventType);
  console.log("Webhook data:", JSON.stringify(evt.data, null, 2));

  try {
    if (eventType === "user.created") {
      const {
        id,
        image_url: imageUrl,
        first_name: firstName,
        last_name: lastName,
        email_addresses: emailAddresses,
        username,
      } = evt.data;

      // Validate required fields
      if (!id || !emailAddresses || emailAddresses.length === 0) {
        console.error("Missing required fields:", { id, emailAddresses });
        return NextResponse.json(
          { error: "Missing required fields" },
          { status: 400 },
        );
      }

      // Generate fallback username if not provided or null
      const fallbackUsername =
        username && username.trim() !== ""
          ? username
          : emailAddresses[0]?.email_address.split("@")[0] ||
          `user_${id.slice(-8)}`;

      const mongoUser = await createUser({
        clerkId: id,
        name: `${firstName || ""}${lastName ? ` ${lastName}` : ""}`.trim() ||
          "Anonymous User",
        picture: imageUrl || "/default-avatar.png",
        email: emailAddresses[0].email_address,
        username: fallbackUsername,
      });

      return NextResponse.json(
        { message: "OK", user: mongoUser },
        { status: 201 },
      );
    }

    if (eventType === "user.updated") {
      const {
        id,
        image_url: imageUrl,
        first_name: firstName,
        last_name: lastName,
        email_addresses: emailAddresses,
        username,
      } = evt.data;

      // Validate required fields
      if (!id) {
        console.error("Missing user ID for update");
        return NextResponse.json(
          { error: "Missing user ID" },
          { status: 400 },
        );
      }

      // Build update data object, only including fields that exist
      const updateData: any = {};

      if (firstName || lastName) {
        updateData.name = `${firstName || ""}${lastName ? ` ${lastName}` : ""}`.trim() ||
          "Anonymous User";
      }

      if (imageUrl) {
        updateData.picture = imageUrl;
      }

      if (emailAddresses && emailAddresses.length > 0) {
        updateData.email = emailAddresses[0].email_address;
      }

      if (username && username.trim() !== "") {
        updateData.username = username;
      } else if (emailAddresses && emailAddresses.length > 0) {
        updateData.username =
          emailAddresses[0].email_address.split("@")[0] ||
          `user_${id.slice(-8)}`;
      }

      const mongoUser = await updateUser({
        clerkId: id,
        updateData,
        path: `/profile/${id}`,
      });

      return NextResponse.json(
        { message: "OK", user: mongoUser },
        { status: 200 },
      );
    }

    if (eventType === "user.deleted") {
      const { id } = evt.data;

      if (!id) {
        console.error("Missing user ID for deletion");
        return NextResponse.json(
          { error: "Missing user ID" },
          { status: 400 },
        );
      }

      const deletedUser = await deleteUser({
        clerkId: id,
      });

      return NextResponse.json(
        { message: "OK", user: deletedUser },
        { status: 200 },
      );
    }

    return NextResponse.json({ message: "OK" });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
