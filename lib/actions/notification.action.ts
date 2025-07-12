"use server"

import { connectToDatabase } from "@/lib/mongoose";
import Notification from "@/database/notification.model";
import { revalidatePath } from "next/cache";
import Question from "@/database/question.model";
import User from "@/database/user.model";
import Answer from "@/database/answer.model";

export async function getNotifications(userId: string) {
    try {
        await connectToDatabase();

        const user = await User.findOne({ clerkId: userId });
        if (!user) throw new Error("User not found");

        const notifications = await Notification.find({ recipient: user._id })
            .populate({ path: 'trigger', model: User, select: 'picture name' })
            .populate({ path: 'question', model: Question, select: 'title' })
            .populate({ path: 'answer', model: Answer, select: 'content' })
            .sort({ createdAt: -1 });

        return notifications;
    } catch (error) {
        console.error("Error fetching notifications:", error);
        throw error;
    }
}

export async function markAsRead(notificationId: string) {
    try {
        await connectToDatabase();

        await Notification.findByIdAndUpdate(notificationId, { read: true });

        revalidatePath('/notifications');
    } catch (error) {
        console.error("Error marking notification as read:", error);
        throw error;
    }
}

export async function markAllAsRead(userId: string) {
    try {
        await connectToDatabase();
        
        const user = await User.findOne({ clerkId: userId });
        if (!user) throw new Error("User not found");

        await Notification.updateMany({ recipient: user._id, read: false }, { read: true });

        revalidatePath('/notifications');
    } catch (error) {
        console.error("Error marking all notifications as read:", error);
        throw error;
    }
} 