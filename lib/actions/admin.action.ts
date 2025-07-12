"use server";

import Answer from "@/database/answer.model";
import Question from "@/database/question.model";
import Tag from "@/database/tag.model";
import User from "@/database/user.model";
import Interaction from "@/database/interaction.model";
import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../mongoose";
import { FilterQuery } from "mongoose";

// Admin-only access check (you can enhance this with role-based permissions)
export async function checkAdminAccess(clerkId: string) {
    try {
        connectToDatabase();

        // Add admin email addresses here - UPDATE THESE WITH YOUR ADMIN EMAILS
        const adminEmails = [
            "admin@stackit.com",
            // Add your actual admin email addresses here
            // "your-email@gmail.com",
            // "another-admin@domain.com"
        ];

        const user = await User.findOne({ clerkId });
        if (!user) {
            throw new Error("User not found");
        }

        // For development, you can temporarily comment out the email check
        // and return true to allow any authenticated user to be admin
        if (!adminEmails.includes(user.email)) {
            throw new Error("Unauthorized: Admin access required");
        }

        return true;
    } catch (error) {
        throw new Error("Admin access verification failed");
    }
}

// Get comprehensive admin dashboard analytics
export async function getAdminAnalytics() {
    try {
        connectToDatabase();

        // Basic counts
        const [
            totalUsers,
            totalQuestions,
            totalAnswers,
            totalTags,
            totalInteractions
        ] = await Promise.all([
            User.countDocuments(),
            Question.countDocuments(),
            Answer.countDocuments(),
            Tag.countDocuments(),
            Interaction.countDocuments()
        ]);

        // User statistics by join date (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const newUsersLast30Days = await User.countDocuments({
            joinedAt: { $gte: thirtyDaysAgo }
        });

        // Question statistics
        const questionsLast30Days = await Question.countDocuments({
            createdAt: { $gte: thirtyDaysAgo }
        });

        // Answer statistics
        const answersLast30Days = await Answer.countDocuments({
            createdAt: { $gte: thirtyDaysAgo }
        });

        // Top users by reputation
        const topUsers = await User.find({})
            .sort({ reputation: -1 })
            .limit(10)
            .select("name email reputation joinedAt");

        // Most active users (by questions + answers)
        const mostActiveUsers = await User.aggregate([
            {
                $lookup: {
                    from: "questions",
                    localField: "_id",
                    foreignField: "author",
                    as: "questions"
                }
            },
            {
                $lookup: {
                    from: "answers",
                    localField: "_id",
                    foreignField: "author",
                    as: "answers"
                }
            },
            {
                $project: {
                    name: 1,
                    email: 1,
                    reputation: 1,
                    totalActivity: { $add: [{ $size: "$questions" }, { $size: "$answers" }] },
                    questionsCount: { $size: "$questions" },
                    answersCount: { $size: "$answers" }
                }
            },
            { $sort: { totalActivity: -1 } },
            { $limit: 10 }
        ]);

        // Questions with most views
        const popularQuestions = await Question.find({})
            .sort({ views: -1 })
            .limit(5)
            .populate("author", "name email")
            .populate("tags", "name")
            .select("title views upvotes downvotes createdAt");

        // Recent activity (last 24 hours)
        const twentyFourHoursAgo = new Date();
        twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

        const recentActivity = await Interaction.find({
            createdAt: { $gte: twentyFourHoursAgo }
        })
            .populate("user", "name email")
            .populate("question", "title")
            .sort({ createdAt: -1 })
            .limit(20);

        // Voting statistics
        const [questionVoteStats, answerVoteStats] = await Promise.all([
            Question.aggregate([
                {
                    $project: {
                        upvotesCount: { $size: "$upvotes" },
                        downvotesCount: { $size: "$downvotes" }
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalUpvotes: { $sum: "$upvotesCount" },
                        totalDownvotes: { $sum: "$downvotesCount" }
                    }
                }
            ]),
            Answer.aggregate([
                {
                    $project: {
                        upvotesCount: { $size: "$upvotes" },
                        downvotesCount: { $size: "$downvotes" }
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalUpvotes: { $sum: "$upvotesCount" },
                        totalDownvotes: { $sum: "$downvotesCount" }
                    }
                }
            ])
        ]);

        // Tag usage statistics
        const tagStats = await Tag.aggregate([
            {
                $project: {
                    name: 1,
                    questionCount: { $size: "$questions" },
                    followerCount: { $size: "$followers" }
                }
            },
            { $sort: { questionCount: -1 } },
            { $limit: 10 }
        ]);

        // Growth data for charts (last 12 months)
        const twelveMonthsAgo = new Date();
        twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

        const growthData = await Promise.all([
            // Users growth
            User.aggregate([
                {
                    $match: { joinedAt: { $gte: twelveMonthsAgo } }
                },
                {
                    $group: {
                        _id: {
                            year: { $year: "$joinedAt" },
                            month: { $month: "$joinedAt" }
                        },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { "_id.year": 1, "_id.month": 1 } }
            ]),
            // Questions growth
            Question.aggregate([
                {
                    $match: { createdAt: { $gte: twelveMonthsAgo } }
                },
                {
                    $group: {
                        _id: {
                            year: { $year: "$createdAt" },
                            month: { $month: "$createdAt" }
                        },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { "_id.year": 1, "_id.month": 1 } }
            ]),
            // Answers growth
            Answer.aggregate([
                {
                    $match: { createdAt: { $gte: twelveMonthsAgo } }
                },
                {
                    $group: {
                        _id: {
                            year: { $year: "$createdAt" },
                            month: { $month: "$createdAt" }
                        },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { "_id.year": 1, "_id.month": 1 } }
            ])
        ]);

        // Convert to plain objects to avoid serialization issues
        return {
            overview: {
                totalUsers,
                totalQuestions,
                totalAnswers,
                totalTags,
                totalInteractions,
                newUsersLast30Days,
                questionsLast30Days,
                answersLast30Days
            },
            topUsers: topUsers.map(user => ({
                _id: user._id.toString(),
                name: user.name,
                email: user.email,
                reputation: user.reputation,
                joinedAt: user.joinedAt.toISOString()
            })),
            mostActiveUsers: mostActiveUsers.map(user => ({
                _id: user._id.toString(),
                name: user.name,
                email: user.email,
                reputation: user.reputation,
                totalActivity: user.totalActivity,
                questionsCount: user.questionsCount,
                answersCount: user.answersCount
            })),
            popularQuestions: popularQuestions.map(question => ({
                _id: question._id.toString(),
                title: question.title,
                views: question.views,
                upvotes: question.upvotes.length,
                downvotes: question.downvotes.length,
                createdAt: question.createdAt.toISOString(),
                author: {
                    name: question.author.name,
                    email: question.author.email
                },
                tags: question.tags.map((tag: any) => ({
                    _id: tag._id.toString(),
                    name: tag.name
                }))
            })),
            recentActivity: recentActivity.map(activity => ({
                _id: activity._id.toString(),
                action: activity.action,
                createdAt: activity.createdAt.toISOString(),
                user: activity.user ? {
                    name: activity.user.name,
                    email: activity.user.email
                } : null,
                question: activity.question ? {
                    _id: activity.question._id.toString(),
                    title: activity.question.title
                } : null
            })),
            voteStats: {
                questions: questionVoteStats[0] || { totalUpvotes: 0, totalDownvotes: 0 },
                answers: answerVoteStats[0] || { totalUpvotes: 0, totalDownvotes: 0 }
            },
            tagStats: tagStats.map(tag => ({
                _id: tag._id.toString(),
                name: tag.name,
                questionCount: tag.questionCount,
                followerCount: tag.followerCount
            })),
            growthData: {
                users: growthData[0],
                questions: growthData[1],
                answers: growthData[2]
            }
        };
    } catch (error) {
        console.log(error);
        throw error;
    }
}

// Get all users with detailed information for admin management
export async function getAdminUsers(params: {
    page?: number;
    pageSize?: number;
    searchQuery?: string;
    sortBy?: string;
}) {
    try {
        connectToDatabase();

        const { page = 1, pageSize = 20, searchQuery, sortBy = "newest" } = params;
        const skipAmount = (page - 1) * pageSize;

        const query: FilterQuery<typeof User> = {};

        if (searchQuery) {
            query.$or = [
                { name: { $regex: new RegExp(searchQuery, "i") } },
                { email: { $regex: new RegExp(searchQuery, "i") } },
                { username: { $regex: new RegExp(searchQuery, "i") } }
            ];
        }

        let sortOptions = {};
        switch (sortBy) {
            case "newest":
                sortOptions = { joinedAt: -1 };
                break;
            case "oldest":
                sortOptions = { joinedAt: 1 };
                break;
            case "reputation":
                sortOptions = { reputation: -1 };
                break;
            case "name":
                sortOptions = { name: 1 };
                break;
            default:
                sortOptions = { joinedAt: -1 };
        }

        const users = await User.aggregate([
            { $match: query },
            {
                $lookup: {
                    from: "questions",
                    localField: "_id",
                    foreignField: "author",
                    as: "questions"
                }
            },
            {
                $lookup: {
                    from: "answers",
                    localField: "_id",
                    foreignField: "author",
                    as: "answers"
                }
            },
            {
                $project: {
                    clerkId: 1,
                    name: 1,
                    username: 1,
                    email: 1,
                    picture: 1,
                    reputation: 1,
                    location: 1,
                    joinedAt: 1,
                    questionsCount: { $size: "$questions" },
                    answersCount: { $size: "$answers" },
                    lastActive: {
                        $max: [
                            { $max: "$questions.createdAt" },
                            { $max: "$answers.createdAt" }
                        ]
                    }
                }
            },
            { $sort: sortOptions },
            { $skip: skipAmount },
            { $limit: pageSize }
        ]);

        const totalUsers = await User.countDocuments(query);
        const isNext = totalUsers > skipAmount + users.length;

        // Convert to plain objects
        const serializedUsers = users.map(user => ({
            _id: user._id.toString(),
            clerkId: user.clerkId,
            name: user.name,
            username: user.username,
            email: user.email,
            picture: user.picture,
            reputation: user.reputation,
            location: user.location,
            joinedAt: user.joinedAt.toISOString(),
            questionsCount: user.questionsCount,
            answersCount: user.answersCount,
            lastActive: user.lastActive ? user.lastActive.toISOString() : null
        }));

        return { users: serializedUsers, isNext, totalUsers };
    } catch (error) {
        console.log(error);
        throw error;
    }
}

// Get all answers with detailed information
export async function getAdminAnswers(params: {
    page?: number;
    pageSize?: number;
    searchQuery?: string;
    sortBy?: string;
}) {
    try {
        connectToDatabase();

        const { page = 1, pageSize = 20, searchQuery, sortBy = "newest" } = params;
        const skipAmount = (page - 1) * pageSize;

        const query: FilterQuery<typeof Answer> = {};

        let sortOptions = {};
        switch (sortBy) {
            case "newest":
                sortOptions = { createdAt: -1 };
                break;
            case "oldest":
                sortOptions = { createdAt: 1 };
                break;
            case "upvotes":
                sortOptions = { upvotes: -1 };
                break;
            case "downvotes":
                sortOptions = { downvotes: -1 };
                break;
            default:
                sortOptions = { createdAt: -1 };
        }

        const aggregationPipeline = [
            { $match: query },
            {
                $lookup: {
                    from: "users",
                    localField: "author",
                    foreignField: "_id",
                    as: "author"
                }
            },
            {
                $lookup: {
                    from: "questions",
                    localField: "question",
                    foreignField: "_id",
                    as: "question"
                }
            },
            { $unwind: "$author" },
            { $unwind: "$question" },
            {
                $project: {
                    content: 1,
                    createdAt: 1,
                    upvotesCount: { $size: "$upvotes" },
                    downvotesCount: { $size: "$downvotes" },
                    "author.name": 1,
                    "author.email": 1,
                    "author.clerkId": 1,
                    "author.picture": 1,
                    "question.title": 1,
                    "question._id": 1
                }
            }
        ];

        if (searchQuery) {
            aggregationPipeline.unshift({
                $match: {
                    $or: [
                        { content: { $regex: new RegExp(searchQuery, "i") } },
                        { "author.name": { $regex: new RegExp(searchQuery, "i") } },
                        { "question.title": { $regex: new RegExp(searchQuery, "i") } }
                    ]
                }
            } as any);
        }

        aggregationPipeline.push(
            { $sort: sortOptions } as any,
            { $skip: skipAmount } as any,
            { $limit: pageSize } as any
        );

        const answers = await Answer.aggregate(aggregationPipeline);
        const totalAnswers = await Answer.countDocuments(query);
        const isNext = totalAnswers > skipAmount + answers.length;

        // Convert to plain objects
        const serializedAnswers = answers.map(answer => ({
            _id: answer._id.toString(),
            content: answer.content,
            createdAt: answer.createdAt.toISOString(),
            upvotesCount: answer.upvotesCount,
            downvotesCount: answer.downvotesCount,
            author: {
                name: answer.author.name,
                email: answer.author.email,
                clerkId: answer.author.clerkId,
                picture: answer.author.picture
            },
            question: {
                _id: answer.question._id.toString(),
                title: answer.question.title
            }
        }));

        return { answers: serializedAnswers, isNext, totalAnswers };
    } catch (error) {
        console.log(error);
        throw error;
    }
}

// Admin delete user with cascade
export async function adminDeleteUser(params: {
    userId: string;
    adminClerkId: string;
    path: string;
}) {
    try {
        await checkAdminAccess(params.adminClerkId);
        connectToDatabase();

        const { userId, path } = params;

        const user = await User.findOne({ clerkId: userId });
        if (!user) {
            throw new Error("User not found");
        }

        // Delete all user's questions and their related data
        const userQuestions = await Question.find({ author: user._id });
        const questionIds = userQuestions.map(q => q._id);

        // Delete answers to user's questions
        await Answer.deleteMany({ question: { $in: questionIds } });

        // Delete interactions related to user's questions
        await Interaction.deleteMany({ question: { $in: questionIds } });

        // Delete user's questions
        await Question.deleteMany({ author: user._id });

        // Delete user's answers
        await Answer.deleteMany({ author: user._id });

        // Delete user's interactions
        await Interaction.deleteMany({ user: user._id });

        // Remove user from question upvotes/downvotes
        await Question.updateMany(
            { $or: [{ upvotes: user._id }, { downvotes: user._id }] },
            { $pull: { upvotes: user._id, downvotes: user._id } }
        );

        // Remove user from answer upvotes/downvotes
        await Answer.updateMany(
            { $or: [{ upvotes: user._id }, { downvotes: user._id }] },
            { $pull: { upvotes: user._id, downvotes: user._id } }
        );

        // Remove user from tag followers
        await Tag.updateMany(
            { followers: user._id },
            { $pull: { followers: user._id } }
        );

        // Finally delete the user
        await User.findByIdAndDelete(user._id);

        revalidatePath(path);
        return { success: true, message: "User and all related data deleted successfully" };
    } catch (error) {
        console.log(error);
        throw error;
    }
}

// Admin delete answer
export async function adminDeleteAnswer(params: {
    answerId: string;
    adminClerkId: string;
    path: string;
}) {
    try {
        await checkAdminAccess(params.adminClerkId);
        connectToDatabase();

        const { answerId, path } = params;

        const answer = await Answer.findById(answerId);
        if (!answer) {
            throw new Error("Answer not found");
        }

        // Remove answer from question's answers array
        await Question.findByIdAndUpdate(answer.question, {
            $pull: { answers: answerId }
        });

        // Delete related interactions
        await Interaction.deleteMany({ answer: answerId });

        // Delete the answer
        await Answer.findByIdAndDelete(answerId);

        revalidatePath(path);
        return { success: true, message: "Answer deleted successfully" };
    } catch (error) {
        console.log(error);
        throw error;
    }
}

// Get user detailed analytics
export async function getUserDetailedAnalytics(params: {
    userId: string;
    adminClerkId: string;
}) {
    try {
        await checkAdminAccess(params.adminClerkId);
        connectToDatabase();

        const { userId } = params;

        const user = await User.findOne({ clerkId: userId });
        if (!user) {
            throw new Error("User not found");
        }

        // Get user's questions with detailed stats
        const userQuestions = await Question.find({ author: user._id })
            .populate("tags", "name")
            .sort({ createdAt: -1 });

        // Get user's answers with question details
        const userAnswers = await Answer.find({ author: user._id })
            .populate("question", "title _id")
            .sort({ createdAt: -1 });

        // Get user's voting history
        const questionsUpvoted = await Question.find({ upvotes: user._id }).countDocuments();
        const questionsDownvoted = await Question.find({ downvotes: user._id }).countDocuments();
        const answersUpvoted = await Answer.find({ upvotes: user._id }).countDocuments();
        const answersDownvoted = await Answer.find({ downvotes: user._id }).countDocuments();

        // Get user's interactions
        const interactions = await Interaction.find({ user: user._id })
            .populate("question", "title")
            .populate("answer", "content")
            .sort({ createdAt: -1 })
            .limit(50);

        // Calculate reputation breakdown
        const reputationSources = {
            questionsCreated: userQuestions.length * 10,
            answersCreated: userAnswers.length * 10,
            questionsUpvoted: userQuestions.reduce((sum, q) => sum + q.upvotes.length, 0) * 10,
            answersUpvoted: userAnswers.reduce((sum, a) => sum + a.upvotes.length, 0) * 10,
            questionsDownvoted: userQuestions.reduce((sum, q) => sum - q.downvotes.length, 0) * 10,
            answersDownvoted: userAnswers.reduce((sum, a) => sum - a.downvotes.length, 0) * 10
        };

        return {
            user: {
                _id: user._id.toString(),
                clerkId: user.clerkId,
                name: user.name,
                username: user.username,
                email: user.email,
                picture: user.picture,
                reputation: user.reputation,
                location: user.location,
                joinedAt: user.joinedAt.toISOString()
            },
            questions: userQuestions.map(q => ({
                _id: q._id.toString(),
                title: q.title,
                content: q.content,
                views: q.views,
                upvotes: q.upvotes.length,
                downvotes: q.downvotes.length,
                createdAt: q.createdAt.toISOString(),
                tags: q.tags.map((tag: any) => ({
                    _id: tag._id.toString(),
                    name: tag.name
                }))
            })),
            answers: userAnswers.map(a => ({
                _id: a._id.toString(),
                content: a.content,
                upvotes: a.upvotes.length,
                downvotes: a.downvotes.length,
                createdAt: a.createdAt.toISOString(),
                question: {
                    _id: a.question._id.toString(),
                    title: a.question.title
                }
            })),
            votingActivity: {
                questionsUpvoted,
                questionsDownvoted,
                answersUpvoted,
                answersDownvoted
            },
            interactions: interactions.map(i => ({
                _id: i._id.toString(),
                action: i.action,
                createdAt: i.createdAt.toISOString(),
                question: i.question ? {
                    _id: i.question._id.toString(),
                    title: i.question.title
                } : null,
                answer: i.answer ? {
                    content: i.answer.content.substring(0, 100) + "..."
                } : null
            })),
            reputationSources,
            stats: {
                totalQuestions: userQuestions.length,
                totalAnswers: userAnswers.length,
                totalViews: userQuestions.reduce((sum, q) => sum + q.views, 0),
                avgUpvotesPerQuestion: userQuestions.length > 0
                    ? userQuestions.reduce((sum, q) => sum + q.upvotes.length, 0) / userQuestions.length
                    : 0,
                avgUpvotesPerAnswer: userAnswers.length > 0
                    ? userAnswers.reduce((sum, a) => sum + a.upvotes.length, 0) / userAnswers.length
                    : 0
            }
        };
    } catch (error) {
        console.log(error);
        throw error;
    }
}

// Get detailed platform analytics with more granular data
export async function getDetailedAnalytics(params: {
    adminClerkId: string;
    timeRange?: "7d" | "30d" | "90d" | "1y";
}) {
    try {
        await checkAdminAccess(params.adminClerkId);
        connectToDatabase();

        const { timeRange = "30d" } = params;

        // Calculate date range
        const endDate = new Date();
        const startDate = new Date();

        switch (timeRange) {
            case "7d":
                startDate.setDate(startDate.getDate() - 7);
                break;
            case "30d":
                startDate.setDate(startDate.getDate() - 30);
                break;
            case "90d":
                startDate.setDate(startDate.getDate() - 90);
                break;
            case "1y":
                startDate.setFullYear(startDate.getFullYear() - 1);
                break;
        }

        // Daily activity for the time range
        const dailyStats = await Promise.all([
            // Daily user registrations
            User.aggregate([
                {
                    $match: {
                        joinedAt: { $gte: startDate, $lte: endDate }
                    }
                },
                {
                    $group: {
                        _id: {
                            $dateToString: { format: "%Y-%m-%d", date: "$joinedAt" }
                        },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { "_id": 1 } }
            ]),
            // Daily questions
            Question.aggregate([
                {
                    $match: {
                        createdAt: { $gte: startDate, $lte: endDate }
                    }
                },
                {
                    $group: {
                        _id: {
                            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
                        },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { "_id": 1 } }
            ]),
            // Daily answers
            Answer.aggregate([
                {
                    $match: {
                        createdAt: { $gte: startDate, $lte: endDate }
                    }
                },
                {
                    $group: {
                        _id: {
                            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
                        },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { "_id": 1 } }
            ])
        ]);

        // User engagement metrics
        const engagementMetrics = await User.aggregate([
            {
                $lookup: {
                    from: "questions",
                    localField: "_id",
                    foreignField: "author",
                    as: "questions"
                }
            },
            {
                $lookup: {
                    from: "answers",
                    localField: "_id",
                    foreignField: "author",
                    as: "answers"
                }
            },
            {
                $lookup: {
                    from: "interactions",
                    localField: "_id",
                    foreignField: "user",
                    as: "interactions"
                }
            },
            {
                $project: {
                    questionsCount: { $size: "$questions" },
                    answersCount: { $size: "$answers" },
                    interactionsCount: { $size: "$interactions" },
                    reputation: 1
                }
            },
            {
                $group: {
                    _id: null,
                    totalUsers: { $sum: 1 },
                    activeUsers: {
                        $sum: {
                            $cond: [
                                { $gt: [{ $add: ["$questionsCount", "$answersCount"] }, 0] },
                                1,
                                0
                            ]
                        }
                    },
                    averageReputation: { $avg: "$reputation" },
                    averageQuestions: { $avg: "$questionsCount" },
                    averageAnswers: { $avg: "$answersCount" }
                }
            }
        ]);

        // Content quality metrics
        const qualityMetrics = await Promise.all([
            // Questions with no answers
            Question.countDocuments({ answers: { $size: 0 } }),
            // Questions with accepted answers (mock - would need accepted answer field)
            Question.countDocuments({ answers: { $gt: [] } }),
            // Average question views
            Question.aggregate([
                {
                    $group: {
                        _id: null,
                        averageViews: { $avg: "$views" },
                        maxViews: { $max: "$views" },
                        totalViews: { $sum: "$views" }
                    }
                }
            ])
        ]);

        // Reputation distribution
        const reputationDistribution = await User.aggregate([
            {
                $bucket: {
                    groupBy: "$reputation",
                    boundaries: [0, 100, 500, 1000, 5000, 10000, 50000],
                    default: "50000+",
                    output: {
                        count: { $sum: 1 },
                        users: { $push: { name: "$name", reputation: "$reputation" } }
                    }
                }
            }
        ]);

        return {
            timeRange,
            dailyStats: {
                users: dailyStats[0],
                questions: dailyStats[1],
                answers: dailyStats[2]
            },
            engagement: engagementMetrics[0] || {
                totalUsers: 0,
                activeUsers: 0,
                averageReputation: 0,
                averageQuestions: 0,
                averageAnswers: 0
            },
            quality: {
                unansweredQuestions: qualityMetrics[0],
                answeredQuestions: qualityMetrics[1],
                viewStats: qualityMetrics[2][0] || { averageViews: 0, maxViews: 0, totalViews: 0 }
            },
            reputationDistribution
        };
    } catch (error) {
        console.log(error);
        throw error;
    }
}

// Get system health metrics
export async function getSystemHealth(params: { adminClerkId: string }) {
    try {
        await checkAdminAccess(params.adminClerkId);
        connectToDatabase();

        const now = new Date();
        const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        // Error rates and failed operations (you can expand this)
        const healthMetrics = {
            // Database connectivity
            databaseConnected: true, // This would be false if connection fails

            // Recent activity indicators
            activeLast24h: await Interaction.countDocuments({
                createdAt: { $gte: oneDayAgo }
            }),

            // Content creation rates
            questionsLast24h: await Question.countDocuments({
                createdAt: { $gte: oneDayAgo }
            }),

            answersLast24h: await Answer.countDocuments({
                createdAt: { $gte: oneDayAgo }
            }),

            // User engagement
            activeUsersLast7d: await Interaction.distinct("user", {
                createdAt: { $gte: oneWeekAgo }
            }).then(users => users.length),

            // System load indicators
            totalQuestions: await Question.countDocuments(),
            totalAnswers: await Answer.countDocuments(),
            totalUsers: await User.countDocuments(),

            // Data quality checks
            orphanedAnswers: await Answer.countDocuments({
                question: { $exists: false }
            }),

            usersWithoutEmail: await User.countDocuments({
                email: { $exists: false }
            })
        };

        return healthMetrics;
    } catch (error) {
        console.log(error);
        return {
            databaseConnected: false,
            error: error instanceof Error ? error.message : "Unknown error"
        };
    }
}

// Bulk operations for admin
export async function bulkDeleteUsers(params: {
    userIds: string[];
    adminClerkId: string;
    path: string;
}) {
    try {
        await checkAdminAccess(params.adminClerkId);
        connectToDatabase();

        const { userIds, path } = params;
        const results = [];

        for (const userId of userIds) {
            try {
                await adminDeleteUser({
                    userId,
                    adminClerkId: params.adminClerkId,
                    path
                });
                results.push({ userId, success: true });
            } catch (error) {
                results.push({
                    userId,
                    success: false,
                    error: error instanceof Error ? error.message : "Unknown error"
                });
            }
        }

        revalidatePath(path);
        return {
            results, summary: {
                total: userIds.length,
                successful: results.filter(r => r.success).length,
                failed: results.filter(r => !r.success).length
            }
        };
    } catch (error) {
        console.log(error);
        throw error;
    }
}

// Export data for admin
export async function exportPlatformData(params: {
    adminClerkId: string;
    dataType: "users" | "questions" | "answers" | "all";
    format: "json" | "csv";
}) {
    try {
        await checkAdminAccess(params.adminClerkId);
        connectToDatabase();

        const { dataType, format } = params;

        let data: any = {};

        if (dataType === "users" || dataType === "all") {
            data.users = await User.find({})
                .select("-clerkId") // Remove sensitive data
                .lean();
        }

        if (dataType === "questions" || dataType === "all") {
            data.questions = await Question.find({})
                .populate("author", "name email")
                .populate("tags", "name")
                .lean();
        }

        if (dataType === "answers" || dataType === "all") {
            data.answers = await Answer.find({})
                .populate("author", "name email")
                .populate("question", "title")
                .lean();
        }

        // Convert to CSV if requested (basic implementation)
        if (format === "csv") {
            // This is a simplified CSV conversion
            // In production, you'd want a proper CSV library
            const csvData = JSON.stringify(data);
            return { data: csvData, format: "csv" };
        }

        return { data, format: "json" };
    } catch (error) {
        console.log(error);
        throw error;
    }
}
