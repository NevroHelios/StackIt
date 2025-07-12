"use server";

import Answer from "@/database/answer.model";
import Question from "@/database/question.model";
import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose";
import { revalidatePath } from "next/cache";

// Bot user configuration
const BOT_USER_DATA = {
    clerkId: "bot_stackhelper_ai",
    name: "StackHelper AI",
    username: "stackhelper-ai",
    email: "bot@stackhelper.ai",
    picture: "/assets/icons/bot-avatar.svg",
    joinedAt: new Date(),
    isBot: true,
};

export async function ensureBotUserExists() {
    try {
        await connectToDatabase();

        let botUser = await User.findOne({ clerkId: BOT_USER_DATA.clerkId });

        if (!botUser) {
            botUser = await User.create(BOT_USER_DATA);
        }

        return JSON.parse(JSON.stringify(botUser));
    } catch (error) {
        console.error("Error ensuring bot user exists:", error);
        throw error;
    }
}

export async function createBotAnswer({
    questionId,
    questionContent,
    path,
}: {
    questionId: string;
    questionContent: string;
    path: string;
}) {
    try {
        await connectToDatabase();

        // Ensure bot user exists
        const botUser = await ensureBotUserExists();

        // Generate AI response
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/chatgpt`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ question: questionContent }),
        });

        if (!response.ok) {
            throw new Error("Failed to generate AI response");
        }

        const aiData = await response.json();
        const aiContent = aiData.replay.replace(/\n/g, "<br/>");

        // Create bot answer with disclaimer
        const botAnswerContent = `
      <div style="background-color: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 16px; margin-bottom: 16px;">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
          <span style="background-color: #0ea5e9; color: white; padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: bold;">🤖 AI BOT</span>
          <span style="color: #0369a1; font-weight: 600;">Automated Response</span>
        </div>
        <p style="color: #0369a1; font-size: 14px; margin-bottom: 12px; font-style: italic;">
          This is an AI-generated response. Please verify information and consider consulting additional sources.
        </p>
      </div>
      ${aiContent}
    `;

        // Create the answer
        const answer = await Answer.create({
            content: botAnswerContent,
            author: botUser._id,
            question: questionId,
        });

        // Update question with the answer
        await Question.findByIdAndUpdate(questionId, {
            $push: { answers: answer._id },
        });

        revalidatePath(path);

        return JSON.parse(JSON.stringify(answer));
    } catch (error) {
        console.error("Error creating bot answer:", error);
        throw error;
    }
}
