"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, MessageSquare, HelpCircle, Calendar, TrendingDown } from "lucide-react";

interface AnalyticsChartsProps {
    growthData: {
        users: Array<{
            _id: { year: number; month: number };
            count: number;
        }>;
        questions: Array<{
            _id: { year: number; month: number };
            count: number;
        }>;
        answers: Array<{
            _id: { year: number; month: number };
            count: number;
        }>;
    };
}

const AnalyticsCharts = ({ growthData }: AnalyticsChartsProps) => {
    // Transform growth data for display
    const transformGrowthData = () => {
        const monthNames = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];

        // Create a map of all months
        const allMonths = new Set<string>();
        [...growthData.users, ...growthData.questions, ...growthData.answers].forEach(item => {
            const monthKey = `${item._id.year}-${item._id.month}`;
            allMonths.add(monthKey);
        });

        // Sort months chronologically
        const sortedMonths = Array.from(allMonths).sort((a, b) => {
            const [yearA, monthA] = a.split('-').map(Number);
            const [yearB, monthB] = b.split('-').map(Number);
            if (yearA !== yearB) return yearA - yearB;
            return monthA - monthB;
        });

        return sortedMonths.map(monthKey => {
            const [year, month] = monthKey.split('-').map(Number);
            const monthLabel = `${monthNames[month - 1]} ${year}`;

            const userGrowth = growthData.users.find(u =>
                u._id.year === year && u._id.month === month
            )?.count || 0;

            const questionGrowth = growthData.questions.find(q =>
                q._id.year === year && q._id.month === month
            )?.count || 0;

            const answerGrowth = growthData.answers.find(a =>
                a._id.year === year && a._id.month === month
            )?.count || 0;

            return {
                month: monthLabel,
                users: userGrowth,
                questions: questionGrowth,
                answers: answerGrowth,
                total: userGrowth + questionGrowth + answerGrowth
            };
        });
    };

    const chartData = transformGrowthData();

    // Calculate totals
    const totals = {
        users: chartData.reduce((sum, item) => sum + item.users, 0),
        questions: chartData.reduce((sum, item) => sum + item.questions, 0),
        answers: chartData.reduce((sum, item) => sum + item.answers, 0)
    };

    // Calculate growth rates
    const calculateGrowthRate = (data: number[]): string => {
        if (data.length < 2) return "0";
        const recent = data.slice(-3).reduce((a, b) => a + b, 0) / 3;
        const previous = data.slice(-6, -3).reduce((a, b) => a + b, 0) / 3;
        if (previous === 0) return recent > 0 ? "100" : "0";
        return ((recent - previous) / previous * 100).toFixed(1);
    };

    const userGrowthRate = calculateGrowthRate(chartData.map(d => d.users));
    const questionGrowthRate = calculateGrowthRate(chartData.map(d => d.questions));
    const answerGrowthRate = calculateGrowthRate(chartData.map(d => d.answers));

    const GrowthCard = ({
        title,
        value,
        growthRate,
        icon: Icon,
        color
    }: {
        title: string;
        value: number;
        growthRate: string;
        icon: any;
        color: string;
    }) => {
        const isPositive = parseFloat(growthRate) >= 0;
        return (
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{title}</CardTitle>
                    <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold" style={{ color }}>{value.toLocaleString()}</div>
                    <div className="flex items-center space-x-2 text-xs">
                        <span className="text-muted-foreground">12-month total</span>
                        <Badge
                            variant={isPositive ? "default" : "secondary"}
                            className="text-xs"
                        >
                            {isPositive ? (
                                <TrendingUp className="h-3 w-3 mr-1" />
                            ) : (
                                <TrendingDown className="h-3 w-3 mr-1" />
                            )}
                            {growthRate}% growth
                        </Badge>
                    </div>
                </CardContent>
            </Card>
        );
    };

    // Simple bar chart component
    const SimpleBarChart = ({ data, title }: { data: any[], title: string }) => {
        const maxValue = Math.max(...data.map(d => d.total));

        return (
            <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">{title}</h4>
                <div className="space-y-1">
                    {data.slice(-6).map((item, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm">
                            <div className="w-16 text-xs text-muted-foreground">{item.month}</div>
                            <div className="flex-1 bg-muted rounded-full h-4 relative overflow-hidden">
                                <div
                                    className="h-full bg-blue-500 rounded-full transition-all duration-300"
                                    style={{
                                        width: `${maxValue > 0 ? (item.users / maxValue) * 100 : 0}%`
                                    }}
                                />
                                <div
                                    className="absolute top-0 h-full bg-green-500 rounded-full transition-all duration-300"
                                    style={{
                                        left: `${maxValue > 0 ? (item.users / maxValue) * 100 : 0}%`,
                                        width: `${maxValue > 0 ? (item.questions / maxValue) * 100 : 0}%`
                                    }}
                                />
                                <div
                                    className="absolute top-0 h-full bg-yellow-500 rounded-full transition-all duration-300"
                                    style={{
                                        left: `${maxValue > 0 ? ((item.users + item.questions) / maxValue) * 100 : 0}%`,
                                        width: `${maxValue > 0 ? (item.answers / maxValue) * 100 : 0}%`
                                    }}
                                />
                            </div>
                            <div className="w-12 text-xs text-right">{item.total}</div>
                        </div>
                    ))}
                </div>
                <div className="flex items-center space-x-4 text-xs">
                    <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 bg-blue-500 rounded"></div>
                        <span>Users</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 bg-green-500 rounded"></div>
                        <span>Questions</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                        <span>Answers</span>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-2xl font-bold">Analytics & Charts</h3>
                    <p className="text-muted-foreground">Detailed platform growth and usage analytics</p>
                </div>
                <Badge variant="outline" className="text-lg px-3 py-1">
                    <Calendar className="h-4 w-4 mr-2" />
                    12-Month View
                </Badge>
            </div>

            {/* Growth Summary Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <GrowthCard
                    title="User Growth"
                    value={totals.users}
                    growthRate={userGrowthRate}
                    icon={Users}
                    color="#3b82f6"
                />
                <GrowthCard
                    title="Question Growth"
                    value={totals.questions}
                    growthRate={questionGrowthRate}
                    icon={HelpCircle}
                    color="#10b981"
                />
                <GrowthCard
                    title="Answer Growth"
                    value={totals.answers}
                    growthRate={answerGrowthRate}
                    icon={MessageSquare}
                    color="#f59e0b"
                />
            </div>

            {/* Charts */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Monthly Activity Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Monthly Activity Breakdown</CardTitle>
                        <CardDescription>Last 6 months of platform activity</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <SimpleBarChart data={chartData} title="Activity by Month" />
                    </CardContent>
                </Card>

                {/* Distribution Overview */}
                <Card>
                    <CardHeader>
                        <CardTitle>12-Month Content Distribution</CardTitle>
                        <CardDescription>Total activity breakdown by type</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-4 h-4 bg-blue-500 rounded"></div>
                                        <span className="text-sm">New Users</span>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-semibold">{totals.users.toLocaleString()}</div>
                                        <div className="text-xs text-muted-foreground">
                                            {((totals.users / (totals.users + totals.questions + totals.answers)) * 100).toFixed(1)}%
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-4 h-4 bg-green-500 rounded"></div>
                                        <span className="text-sm">New Questions</span>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-semibold">{totals.questions.toLocaleString()}</div>
                                        <div className="text-xs text-muted-foreground">
                                            {((totals.questions / (totals.users + totals.questions + totals.answers)) * 100).toFixed(1)}%
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                                        <span className="text-sm">New Answers</span>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-semibold">{totals.answers.toLocaleString()}</div>
                                        <div className="text-xs text-muted-foreground">
                                            {((totals.answers / (totals.users + totals.questions + totals.answers)) * 100).toFixed(1)}%
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-4 border-t">
                                <div className="flex justify-between text-sm font-semibold">
                                    <span>Total Activity</span>
                                    <span>{(totals.users + totals.questions + totals.answers).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Growth Trends Summary */}
            <Card>
                <CardHeader>
                    <CardTitle>Growth Trends Analysis</CardTitle>
                    <CardDescription>Key insights from the data</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-3">
                            <h4 className="font-semibold">Positive Trends</h4>
                            <div className="space-y-2 text-sm">
                                {parseFloat(userGrowthRate) > 0 && (
                                    <div className="flex items-center space-x-2 text-green-600">
                                        <TrendingUp className="h-4 w-4" />
                                        <span>User registration up {userGrowthRate}%</span>
                                    </div>
                                )}
                                {parseFloat(questionGrowthRate) > 0 && (
                                    <div className="flex items-center space-x-2 text-green-600">
                                        <TrendingUp className="h-4 w-4" />
                                        <span>Question creation up {questionGrowthRate}%</span>
                                    </div>
                                )}
                                {parseFloat(answerGrowthRate) > 0 && (
                                    <div className="flex items-center space-x-2 text-green-600">
                                        <TrendingUp className="h-4 w-4" />
                                        <span>Answer activity up {answerGrowthRate}%</span>
                                    </div>
                                )}
                                {totals.answers > totals.questions && (
                                    <div className="flex items-center space-x-2 text-blue-600">
                                        <MessageSquare className="h-4 w-4" />
                                        <span>Healthy answer-to-question ratio ({(totals.answers / totals.questions).toFixed(1)}:1)</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="space-y-3">
                            <h4 className="font-semibold">Key Metrics</h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span>Average monthly users:</span>
                                    <span className="font-semibold">{Math.round(totals.users / Math.max(chartData.length, 1))}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Average monthly questions:</span>
                                    <span className="font-semibold">{Math.round(totals.questions / Math.max(chartData.length, 1))}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Average monthly answers:</span>
                                    <span className="font-semibold">{Math.round(totals.answers / Math.max(chartData.length, 1))}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Total platform activity:</span>
                                    <span className="font-semibold">{(totals.users + totals.questions + totals.answers).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Monthly Breakdown Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Monthly Activity Details</CardTitle>
                    <CardDescription>Detailed monthly breakdown of all activity</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-2">Month</th>
                                    <th className="text-right py-2">Users</th>
                                    <th className="text-right py-2">Questions</th>
                                    <th className="text-right py-2">Answers</th>
                                    <th className="text-right py-2">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {chartData.slice(-12).map((item, index) => (
                                    <tr key={index} className="border-b hover:bg-muted/50">
                                        <td className="py-2 font-medium">{item.month}</td>
                                        <td className="text-right py-2">{item.users}</td>
                                        <td className="text-right py-2">{item.questions}</td>
                                        <td className="text-right py-2">{item.answers}</td>
                                        <td className="text-right py-2 font-semibold">{item.total}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default AnalyticsCharts;
