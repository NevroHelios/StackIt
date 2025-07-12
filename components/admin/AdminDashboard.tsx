"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import UserManagement from "./UserManagement";
import AnswerManagement from "./AnswerManagement";
import AnalyticsCharts from "./AnalyticsCharts";
import RecentActivity from "./RecentActivity";
import { 
  Users, 
  MessageSquare, 
  HelpCircle, 
  Tag, 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  ThumbsUp,
  Activity,
  BarChart3,
  Zap
} from "lucide-react";

interface AdminDashboardProps {
    analytics: {
        overview: {
            totalUsers: number;
            totalQuestions: number;
            totalAnswers: number;
            totalTags: number;
            totalInteractions: number;
            newUsersLast30Days: number;
            questionsLast30Days: number;
            answersLast30Days: number;
        };
        topUsers: any[];
        mostActiveUsers: any[];
        popularQuestions: any[];
        recentActivity: any[];
        voteStats: {
            questions: { totalUpvotes: number; totalDownvotes: number };
            answers: { totalUpvotes: number; totalDownvotes: number };
        };
        tagStats: any[];
        growthData: {
            users: any[];
            questions: any[];
            answers: any[];
        };
    };
}

const AdminDashboard = ({ analytics }: AdminDashboardProps) => {
    const [activeTab, setActiveTab] = useState("overview");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const { overview, topUsers, mostActiveUsers, popularQuestions, recentActivity, voteStats, tagStats, growthData } = analytics;

    const calculateGrowthPercentage = (current: number, previous: number): string => {
        if (previous === 0) return current > 0 ? "100" : "0";
        return ((current - previous) / previous * 100).toFixed(1);
    };

    const StatCard = ({
        title,
        value,
        description,
        icon: Icon,
        trend,
        trendValue,
        delay = 0
    }: {
        title: string;
        value: number;
        description: string;
        icon: any;
        trend?: "up" | "down";
        trendValue?: string;
        delay?: number;
    }) => (
        <Card className={`group relative overflow-hidden transition-all duration-500 hover:shadow-xl hover:shadow-blue-100/50 dark:hover:shadow-blue-900/20 hover:-translate-y-1 border-0 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm ${mounted ? 'animate-fade-in-up' : 'opacity-0'}`} 
              style={{ animationDelay: `${delay}ms` }}>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-900/10 dark:to-indigo-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300">{title}</CardTitle>
                <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 group-hover:from-blue-600 group-hover:to-indigo-700 transition-all duration-200">
                    <Icon className="h-4 w-4 text-white" />
                </div>
            </CardHeader>
            <CardContent className="relative">
                <div className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                    {value.toLocaleString()}
                </div>
                <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                    <span>{description}</span>
                    {trend && trendValue && (
                        <Badge variant={trend === "up" ? "default" : "secondary"} 
                               className={`text-xs animate-pulse ${trend === "up" ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"} text-white`}>
                            {trend === "up" ? (
                                <TrendingUp className="h-3 w-3 mr-1" />
                            ) : (
                                <TrendingDown className="h-3 w-3 mr-1" />
                            )}
                            {trendValue}%
                        </Badge>
                    )}
                </div>
            </CardContent>
        </Card>
    );

    const AnimatedCard = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
        <Card className={`transition-all duration-500 hover:shadow-lg hover:-translate-y-1 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-0 ${mounted ? 'animate-fade-in-up' : 'opacity-0'}`}
              style={{ animationDelay: `${delay}ms` }}>
            {children}
        </Card>
    );

    return (
        <div className="min-h-screen p-4 md:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className={`flex items-center justify-between ${mounted ? 'animate-fade-in' : 'opacity-0'}`}>
                    <div className="space-y-2">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-800 dark:from-slate-100 dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent">
                            Admin Dashboard
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400">
                            Welcome back! Here's what's happening on your platform.
                        </p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Badge variant="outline" className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 animate-pulse">
                            <Activity className="h-3 w-3 mr-1" />
                            System Online
                        </Badge>
                        <Badge variant="outline" className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0">
                            <Zap className="h-3 w-3 mr-1" />
                            Admin Panel
                        </Badge>
                    </div>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className={`grid w-full grid-cols-5 bg-white/70 dark:bg-slate-800/70 backdrop-blur-md border-0 ${mounted ? 'animate-fade-in' : 'opacity-0'}`}
                               style={{ animationDelay: "200ms" }}>
                        <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white transition-all duration-200">
                            <BarChart3 className="h-4 w-4 mr-2" />
                            Overview
                        </TabsTrigger>
                        <TabsTrigger value="users" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white transition-all duration-200">
                            <Users className="h-4 w-4 mr-2" />
                            Users
                        </TabsTrigger>
                        <TabsTrigger value="answers" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white transition-all duration-200">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Answers
                        </TabsTrigger>
                        <TabsTrigger value="analytics" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white transition-all duration-200">
                            <TrendingUp className="h-4 w-4 mr-2" />
                            Analytics
                        </TabsTrigger>
                        <TabsTrigger value="activity" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white transition-all duration-200">
                            <Activity className="h-4 w-4 mr-2" />
                            Activity
                        </TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="space-y-8 mt-8">
                        {/* Key Metrics */}
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                            <StatCard
                                title="Total Users"
                                value={overview.totalUsers}
                                description="Platform members"
                                icon={Users}
                                trend="up"
                                trendValue={calculateGrowthPercentage(overview.newUsersLast30Days, overview.totalUsers - overview.newUsersLast30Days)}
                                delay={0}
                            />
                            <StatCard
                                title="Total Questions"
                                value={overview.totalQuestions}
                                description="Questions asked"
                                icon={HelpCircle}
                                trend="up"
                                trendValue={calculateGrowthPercentage(overview.questionsLast30Days, overview.totalQuestions - overview.questionsLast30Days)}
                                delay={100}
                            />
                            <StatCard
                                title="Total Answers"
                                value={overview.totalAnswers}
                                description="Answers provided"
                                icon={MessageSquare}
                                trend="up"
                                trendValue={calculateGrowthPercentage(overview.answersLast30Days, overview.totalAnswers - overview.answersLast30Days)}
                                delay={200}
                            />
                            <StatCard
                                title="Total Tags"
                                value={overview.totalTags}
                                description="Available tags"
                                icon={Tag}
                                delay={300}
                            />
                        </div>

                        {/* 30-Day Activity */}
                        <div className="grid gap-6 md:grid-cols-3">
                            <AnimatedCard delay={400}>
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600">
                                            <Users className="h-4 w-4 text-white" />
                                        </div>
                                        New Users (30 days)
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold text-green-600">{overview.newUsersLast30Days}</div>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">New registrations</p>
                                </CardContent>
                            </AnimatedCard>
                            <AnimatedCard delay={500}>
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600">
                                            <HelpCircle className="h-4 w-4 text-white" />
                                        </div>
                                        New Questions (30 days)
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold text-blue-600">{overview.questionsLast30Days}</div>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Questions asked</p>
                                </CardContent>
                            </AnimatedCard>
                            <AnimatedCard delay={600}>
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600">
                                            <MessageSquare className="h-4 w-4 text-white" />
                                        </div>
                                        New Answers (30 days)
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold text-purple-600">{overview.answersLast30Days}</div>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Answers provided</p>
                                </CardContent>
                            </AnimatedCard>
                        </div>

                        {/* Voting Statistics */}
                        <div className="grid gap-6 md:grid-cols-2">
                            <AnimatedCard delay={700}>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <div className="p-2 rounded-lg bg-gradient-to-r from-emerald-500 to-green-600">
                                            <ThumbsUp className="h-4 w-4 text-white" />
                                        </div>
                                        Question Votes
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-slate-500 dark:text-slate-400">Upvotes</span>
                                            <span className="font-semibold text-green-600 text-xl">
                                                {voteStats.questions.totalUpvotes.toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-slate-500 dark:text-slate-400">Downvotes</span>
                                            <span className="font-semibold text-red-600 text-xl">
                                                {voteStats.questions.totalDownvotes.toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="pt-2 border-t">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-medium">Net Score</span>
                                                <span className="font-bold text-2xl bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                                    {(voteStats.questions.totalUpvotes - voteStats.questions.totalDownvotes).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </AnimatedCard>

                            <AnimatedCard delay={800}>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600">
                                            <MessageSquare className="h-4 w-4 text-white" />
                                        </div>
                                        Answer Votes
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-slate-500 dark:text-slate-400">Upvotes</span>
                                            <span className="font-semibold text-green-600 text-xl">
                                                {voteStats.answers.totalUpvotes.toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-slate-500 dark:text-slate-400">Downvotes</span>
                                            <span className="font-semibold text-red-600 text-xl">
                                                {voteStats.answers.totalDownvotes.toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="pt-2 border-t">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-medium">Net Score</span>
                                                <span className="font-bold text-2xl bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                                    {(voteStats.answers.totalUpvotes - voteStats.answers.totalDownvotes).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </AnimatedCard>
                        </div>

                        {/* Top Performers */}
                        <div className="grid gap-6 md:grid-cols-2">
                            <AnimatedCard delay={900}>
                                <CardHeader>
                                    <CardTitle>Top Users by Reputation</CardTitle>
                                    <CardDescription>Highest reputation scores</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {topUsers.slice(0, 5).map((user, index) => (
                                            <div key={user._id} className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800 dark:to-blue-900 hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-900 dark:hover:to-indigo-900 transition-all duration-200">
                                                <div className="flex items-center space-x-3">
                                                    <Badge variant="outline" className="w-8 h-8 rounded-full p-0 flex items-center justify-center text-sm font-bold bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0">
                                                        {index + 1}
                                                    </Badge>
                                                    <div>
                                                        <p className="font-medium">{user.name}</p>
                                                        <p className="text-sm text-slate-500 dark:text-slate-400">{user.email}</p>
                                                    </div>
                                                </div>
                                                <Badge variant="secondary" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                                                    {user.reputation}
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </AnimatedCard>

                            <AnimatedCard delay={1000}>
                                <CardHeader>
                                    <CardTitle>Most Active Users</CardTitle>
                                    <CardDescription>By questions + answers</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {mostActiveUsers.slice(0, 5).map((user, index) => (
                                            <div key={user._id} className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-slate-50 to-emerald-50 dark:from-slate-800 dark:to-emerald-900 hover:from-emerald-50 hover:to-green-50 dark:hover:from-emerald-900 dark:hover:to-green-900 transition-all duration-200">
                                                <div className="flex items-center space-x-3">
                                                    <Badge variant="outline" className="w-8 h-8 rounded-full p-0 flex items-center justify-center text-sm font-bold bg-gradient-to-r from-green-400 to-emerald-500 text-white border-0">
                                                        {index + 1}
                                                    </Badge>
                                                    <div>
                                                        <p className="font-medium">{user.name}</p>
                                                        <p className="text-sm text-slate-500 dark:text-slate-400">
                                                            {user.questionsCount}Q • {user.answersCount}A
                                                        </p>
                                                    </div>
                                                </div>
                                                <Badge variant="secondary" className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                                                    {user.totalActivity}
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </AnimatedCard>
                        </div>

                        {/* Popular Questions */}
                        <AnimatedCard delay={1100}>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <div className="p-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-600">
                                        <Eye className="h-4 w-4 text-white" />
                                    </div>
                                    Most Viewed Questions
                                </CardTitle>
                                <CardDescription>Questions with highest view counts</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {popularQuestions.map((question, index) => (
                                        <div key={question._id} className="border rounded-lg p-4 bg-gradient-to-r from-white to-slate-50 dark:from-slate-800 dark:to-slate-700 hover:from-slate-50 hover:to-slate-100 dark:hover:from-slate-700 dark:hover:to-slate-600 transition-all duration-200 hover:shadow-md">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <h4 className="font-medium line-clamp-2 text-slate-900 dark:text-slate-100">{question.title}</h4>
                                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                                        by {question.author.name} • {new Date(question.createdAt).toLocaleDateString()}
                                                    </p>
                                                    <div className="flex items-center space-x-3 mt-3">
                                                        <Badge variant="outline" className="text-xs bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                                                            {question.views} views
                                                        </Badge>
                                                        <Badge variant="outline" className="text-xs bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0">
                                                            {question.upvotes.length} upvotes
                                                        </Badge>
                                                        {question.downvotes.length > 0 && (
                                                            <Badge variant="outline" className="text-xs bg-gradient-to-r from-red-500 to-rose-500 text-white border-0">
                                                                {question.downvotes.length} downvotes
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </AnimatedCard>

                        {/* Top Tags */}
                        <AnimatedCard delay={1200}>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <div className="p-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600">
                                        <Tag className="h-4 w-4 text-white" />
                                    </div>
                                    Popular Tags
                                </CardTitle>
                                <CardDescription>Most used tags by question count</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                    {tagStats.slice(0, 10).map((tag, index) => (
                                        <div key={tag._id} className="text-center p-4 border rounded-lg bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-700 hover:from-slate-50 hover:to-slate-100 dark:hover:from-slate-700 dark:hover:to-slate-600 transition-all duration-200 hover:shadow-md hover:-translate-y-1">
                                            <div className="font-bold text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                                {tag.questionCount}
                                            </div>
                                            <div className="text-sm font-medium text-slate-900 dark:text-slate-100 mt-1">{tag.name}</div>
                                            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{tag.followerCount} followers</div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </AnimatedCard>
                    </TabsContent>

                    {/* Users Tab */}
                    <TabsContent value="users">
                        <div className={`${mounted ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: "300ms" }}>
                            <UserManagement />
                        </div>
                    </TabsContent>

                    {/* Answers Tab */}
                    <TabsContent value="answers">
                        <div className={`${mounted ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: "300ms" }}>
                            <AnswerManagement />
                        </div>
                    </TabsContent>

                    {/* Analytics Tab */}
                    <TabsContent value="analytics">
                        <div className={`${mounted ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: "300ms" }}>
                            <AnalyticsCharts growthData={growthData} />
                        </div>
                    </TabsContent>

                    {/* Activity Tab */}
                    <TabsContent value="activity">
                        <div className={`${mounted ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: "300ms" }}>
                            <RecentActivity activities={recentActivity} />
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default AdminDashboard;
