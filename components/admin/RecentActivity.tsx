"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Activity, User, MessageSquare, HelpCircle, Eye, ThumbsUp, ThumbsDown, Clock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getTimestamp } from "@/lib/utils";

interface RecentActivityProps {
    activities: Array<{
        _id: string;
        action: string;
        createdAt: string;
        user: {
            _id: string;
            name: string;
            email: string;
            picture?: string;
        };
        question?: {
            _id: string;
            title: string;
        };
        answer?: {
            _id: string;
            content: string;
        };
    }>;
}

const RecentActivity = ({ activities }: RecentActivityProps) => {
    const getActionIcon = (action: string) => {
        switch (action.toLowerCase()) {
            case "ask_question":
                return <HelpCircle className="h-4 w-4 text-blue-600" />;
            case "answer":
                return <MessageSquare className="h-4 w-4 text-green-600" />;
            case "view":
                return <Eye className="h-4 w-4 text-gray-500" />;
            case "upvote":
                return <ThumbsUp className="h-4 w-4 text-green-600" />;
            case "downvote":
                return <ThumbsDown className="h-4 w-4 text-red-600" />;
            default:
                return <Activity className="h-4 w-4 text-blue-600" />;
        }
    };

    const getActionColor = (action: string) => {
        switch (action.toLowerCase()) {
            case "ask_question":
                return "bg-blue-100 text-blue-800 border-blue-200";
            case "answer":
                return "bg-green-100 text-green-800 border-green-200";
            case "view":
                return "bg-gray-100 text-gray-800 border-gray-200";
            case "upvote":
                return "bg-green-100 text-green-800 border-green-200";
            case "downvote":
                return "bg-red-100 text-red-800 border-red-200";
            default:
                return "bg-blue-100 text-blue-800 border-blue-200";
        }
    };

    const getActionDescription = (activity: any) => {
        const { action, user, question, answer } = activity;
        const userName = user?.name || "Unknown User";

        switch (action.toLowerCase()) {
            case "ask_question":
                return `${userName} asked a question: "${question?.title || 'Unknown Question'}"`;
            case "answer":
                return `${userName} answered: "${question?.title || 'Unknown Question'}"`;
            case "view":
                return `${userName} viewed: "${question?.title || 'Unknown Question'}"`;
            case "upvote":
                return `${userName} upvoted content`;
            case "downvote":
                return `${userName} downvoted content`;
            default:
                return `${userName} performed action: ${action}`;
        }
    };

    const formatActionType = (action: string) => {
        return action
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    // Group activities by time periods
    const groupActivitiesByTime = () => {
        const now = new Date();
        const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
        const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        const groups = {
            lastHour: [] as any[],
            today: [] as any[],
            thisWeek: [] as any[],
            older: [] as any[]
        };

        activities.forEach(activity => {
            const activityDate = new Date(activity.createdAt);

            if (activityDate >= oneHourAgo) {
                groups.lastHour.push(activity);
            } else if (activityDate >= oneDayAgo) {
                groups.today.push(activity);
            } else if (activityDate >= oneWeekAgo) {
                groups.thisWeek.push(activity);
            } else {
                groups.older.push(activity);
            }
        });

        return groups;
    };

    const activityGroups = groupActivitiesByTime();

    // Calculate activity stats
    const activityStats = {
        total: activities.length,
        questions: activities.filter(a => a.action === "ask_question").length,
        answers: activities.filter(a => a.action === "answer").length,
        views: activities.filter(a => a.action === "view").length,
        votes: activities.filter(a => a.action === "upvote" || a.action === "downvote").length
    };

    const ActivityGroup = ({ title, activities, icon }: { title: string; activities: any[]; icon: React.ReactNode }) => {
        if (activities.length === 0) return null;

        return (
            <div className="space-y-3">
                <div className="flex items-center space-x-2">
                    {icon}
                    <h4 className="font-semibold text-sm">{title}</h4>
                    <Badge variant="outline" className="text-xs">{activities.length}</Badge>
                </div>
                <div className="space-y-3 pl-6">
                    {activities.slice(0, 10).map((activity, index) => (
                        <div key={`${activity._id}-${index}`} className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                            <div className="flex-shrink-0 mt-1">
                                {getActionIcon(activity.action)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center space-x-2 mb-1">
                                            {activity.user?.picture && (
                                                <Image
                                                    src={activity.user.picture}
                                                    alt={activity.user.name}
                                                    width={20}
                                                    height={20}
                                                    className="rounded-full"
                                                />
                                            )}
                                            <span className="text-sm font-medium truncate">{activity.user?.name || "Unknown User"}</span>
                                            <Badge
                                                variant="outline"
                                                className={`text-xs ${getActionColor(activity.action)}`}
                                            >
                                                {formatActionType(activity.action)}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-1">
                                            {getActionDescription(activity)}
                                        </p>
                                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                                            <Clock className="h-3 w-3" />
                                            <span>{getTimestamp(new Date(activity.createdAt))}</span>
                                            <span>•</span>
                                            <span className="truncate">{activity.user?.email}</span>
                                        </div>
                                    </div>
                                    {activity.question && (
                                        <Link href={`/question/${activity.question._id}`}>
                                            <Button variant="outline" size="sm" className="ml-2 flex-shrink-0">
                                                View
                                            </Button>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                    {activities.length > 10 && (
                        <div className="text-center">
                            <p className="text-sm text-muted-foreground">
                                And {activities.length - 10} more activities...
                            </p>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-2xl font-bold">Recent Activity</h3>
                    <p className="text-muted-foreground">Latest user actions and platform activity</p>
                </div>
                <Badge variant="outline" className="text-lg px-3 py-1">
                    <Activity className="h-4 w-4 mr-2" />
                    Last 24 Hours
                </Badge>
            </div>

            {/* Activity Stats */}
            <div className="grid gap-4 md:grid-cols-5">
                <Card>
                    <CardContent className="p-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">{activityStats.total}</div>
                            <div className="text-xs text-muted-foreground">Total Actions</div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">{activityStats.questions}</div>
                            <div className="text-xs text-muted-foreground">Questions</div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">{activityStats.answers}</div>
                            <div className="text-xs text-muted-foreground">Answers</div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-gray-600">{activityStats.views}</div>
                            <div className="text-xs text-muted-foreground">Views</div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-purple-600">{activityStats.votes}</div>
                            <div className="text-xs text-muted-foreground">Votes</div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Activity Timeline */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5" />
                        Activity Timeline
                    </CardTitle>
                    <CardDescription>
                        Real-time feed of user activities across the platform
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {activities.length === 0 ? (
                        <div className="text-center py-12">
                            <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No recent activity</h3>
                            <p className="text-muted-foreground">
                                No user activities recorded in the last 24 hours
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <ActivityGroup
                                title="Last Hour"
                                activities={activityGroups.lastHour}
                                icon={<Clock className="h-4 w-4 text-green-600" />}
                            />

                            <ActivityGroup
                                title="Earlier Today"
                                activities={activityGroups.today}
                                icon={<Clock className="h-4 w-4 text-blue-600" />}
                            />

                            <ActivityGroup
                                title="This Week"
                                activities={activityGroups.thisWeek}
                                icon={<Clock className="h-4 w-4 text-orange-600" />}
                            />

                            <ActivityGroup
                                title="Older"
                                activities={activityGroups.older}
                                icon={<Clock className="h-4 w-4 text-gray-600" />}
                            />
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Activity Summary */}
            <Card>
                <CardHeader>
                    <CardTitle>Activity Summary</CardTitle>
                    <CardDescription>Breakdown of recent platform activity</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-3">
                            <h4 className="font-semibold">Most Active Users</h4>
                            <div className="space-y-2">
                                {(() => {
                                    const userActivityCount = activities.reduce((acc, activity) => {
                                        const userId = activity.user?._id;
                                        if (userId) {
                                            acc[userId] = (acc[userId] || 0) + 1;
                                        }
                                        return acc;
                                    }, {} as Record<string, number>);

                                    const sortedUsers = Object.entries(userActivityCount)
                                        .sort(([, a], [, b]) => b - a)
                                        .slice(0, 5);

                                    return sortedUsers.map(([userId, count]) => {
                                        const user = activities.find(a => a.user?._id === userId)?.user;
                                        return (
                                            <div key={userId} className="flex items-center justify-between text-sm">
                                                <div className="flex items-center space-x-2">
                                                    {user?.picture && (
                                                        <Image
                                                            src={user.picture}
                                                            alt={user.name}
                                                            width={24}
                                                            height={24}
                                                            className="rounded-full"
                                                        />
                                                    )}
                                                    <span className="font-medium">{user?.name || "Unknown"}</span>
                                                </div>
                                                <Badge variant="secondary">{count} actions</Badge>
                                            </div>
                                        );
                                    });
                                })()}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h4 className="font-semibold">Action Types</h4>
                            <div className="space-y-2">
                                {(() => {
                                    const actionCounts = activities.reduce((acc, activity) => {
                                        acc[activity.action] = (acc[activity.action] || 0) + 1;
                                        return acc;
                                    }, {} as Record<string, number>);

                                    return Object.entries(actionCounts)
                                        .sort(([, a], [, b]) => b - a)
                                        .map(([action, count]) => (
                                            <div key={action} className="flex items-center justify-between text-sm">
                                                <div className="flex items-center space-x-2">
                                                    {getActionIcon(action)}
                                                    <span className="font-medium">{formatActionType(action)}</span>
                                                </div>
                                                <Badge variant="secondary">{count}</Badge>
                                            </div>
                                        ));
                                })()}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default RecentActivity;
