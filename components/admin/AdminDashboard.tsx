"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserManagement from "./UserManagement";
import AnswerManagement from "./AnswerManagement";
import AnalyticsCharts from "./AnalyticsCharts";
import RecentActivity from "./RecentActivity";
import { 
  Users, 
  MessageSquare, 
  HelpCircle, 
  Tag, 
} from "lucide-react";

interface AdminDashboardProps {
    analytics: {
        overview: {
            totalUsers: number;
            totalQuestions: number;
            totalAnswers: number;
            totalTags: number;
        };
        recentActivity: any[];
        growthData: any;
    };
}

    const StatCard = ({
        title,
        value,
        icon: Icon,
    }: {
        title: string;
        value: number;
        icon: any;
    }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value.toLocaleString()}</div>
            </CardContent>
        </Card>
    );

const AdminDashboard = ({ analytics }: AdminDashboardProps) => {
    const { overview, recentActivity, growthData } = analytics;

    return (
        <div className="p-6">
            <h1 className="h1-bold text-dark100_light900">Admin Dashboard</h1>

            {/* Overview Stats */}
            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Total Users" value={overview.totalUsers} icon={Users} />
                <StatCard title="Total Questions" value={overview.totalQuestions} icon={HelpCircle} />
                <StatCard title="Total Answers" value={overview.totalAnswers} icon={MessageSquare} />
                <StatCard title="Total Tags" value={overview.totalTags} icon={Tag} />
                </div>

            <Tabs defaultValue="users" className="mt-8">
                <TabsList>
                    <TabsTrigger value="users">User Management</TabsTrigger>
                    <TabsTrigger value="answers">Answer Management</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                    <TabsTrigger value="activity">Recent Activity</TabsTrigger>
                    </TabsList>
                <TabsContent value="users" className="mt-6">
                            <UserManagement />
                    </TabsContent>
                <TabsContent value="answers" className="mt-6">
                            <AnswerManagement />
                    </TabsContent>
                <TabsContent value="analytics" className="mt-6">
                    <AnalyticsCharts 
                        growthData={growthData} 
                    />
                    </TabsContent>
                <TabsContent value="activity" className="mt-6">
                            <RecentActivity activities={recentActivity} />
                    </TabsContent>
                </Tabs>
        </div>
    );
};

export default AdminDashboard;
