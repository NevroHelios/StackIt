"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Search, MessageSquare, ThumbsUp, ThumbsDown, User } from "lucide-react";
import { getAdminAnswers, adminDeleteAnswer } from "@/lib/actions/admin.action";
import { useAuth } from "@clerk/nextjs";
import { toast } from "@/components/ui/use-toast";
import ParseHTML from "@/components/shared/ParseHTML";
import Image from "next/image";
import Link from "next/link";
import { getTimestamp } from "@/lib/utils";

interface Answer {
    _id: string;
    content: string;
    createdAt: string;
    upvotesCount: number;
    downvotesCount: number;
    author: {
        name: string;
        email: string;
        clerkId: string;
        picture: string;
    };
    question: {
        title: string;
        _id: string;
    };
}

const AnswerManagement = () => {
    const { userId } = useAuth();
    const [answers, setAnswers] = useState<Answer[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("newest");
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [totalAnswers, setTotalAnswers] = useState(0);

    const pageSize = 20;

    const fetchAnswers = async (newPage = 1, newSearch = searchQuery, newSort = sortBy) => {
        try {
            setLoading(true);
            const result = await getAdminAnswers({
                page: newPage,
                pageSize,
                searchQuery: newSearch || undefined,
                sortBy: newSort
            });

            if (newPage === 1) {
                setAnswers(result.answers);
            } else {
                setAnswers(prev => [...prev, ...result.answers]);
            }

            setHasMore(result.isNext);
            setTotalAnswers(result.totalAnswers);
            setPage(newPage);
        } catch (error) {
            console.error("Error fetching answers:", error);
            toast({
                title: "Error",
                description: "Failed to fetch answers",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAnswer = async (answer: Answer) => {
        if (!userId) return;

        const confirmDelete = window.confirm(
            `Are you sure you want to delete this answer by ${answer.author.name}? This action cannot be undone.`
        );

        if (!confirmDelete) return;

        try {
            setDeleting(answer._id);
            await adminDeleteAnswer({
                answerId: answer._id,
                adminClerkId: userId,
                path: "/admin"
            });

            setAnswers(prev => prev.filter(a => a._id !== answer._id));
            setTotalAnswers(prev => prev - 1);

            toast({
                title: "Success",
                description: "Answer has been deleted successfully",
                variant: "default",
            });
        } catch (error) {
            console.error("Error deleting answer:", error);
            toast({
                title: "Error",
                description: "Failed to delete answer",
                variant: "destructive",
            });
        } finally {
            setDeleting(null);
        }
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setPage(1);
        fetchAnswers(1, query, sortBy);
    };

    const handleSort = (newSort: string) => {
        setSortBy(newSort);
        setPage(1);
        fetchAnswers(1, searchQuery, newSort);
    };

    const loadMore = () => {
        if (hasMore && !loading) {
            fetchAnswers(page + 1);
        }
    };

    const truncateContent = (content: string, maxLength: number = 200) => {
        const textContent = content.replace(/<[^>]*>/g, '');
        return textContent.length > maxLength
            ? textContent.substring(0, maxLength) + '...'
            : textContent;
    };

    useEffect(() => {
        fetchAnswers();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-2xl font-bold">Answer Management</h3>
                    <p className="text-muted-foreground">Manage and moderate platform answers</p>
                </div>
                <Badge variant="outline" className="text-lg px-3 py-1">
                    {totalAnswers.toLocaleString()} Total Answers
                </Badge>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search answers by content, author, or question title..."
                                    value={searchQuery}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    className="pl-8"
                                />
                            </div>
                        </div>
                        <Select value={sortBy} onValueChange={handleSort}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="newest">Newest First</SelectItem>
                                <SelectItem value="oldest">Oldest First</SelectItem>
                                <SelectItem value="upvotes">Most Upvotes</SelectItem>
                                <SelectItem value="downvotes">Most Downvotes</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Answers List */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5" />
                        Platform Answers
                    </CardTitle>
                    <CardDescription>
                        {searchQuery ? `Found ${answers.length} answers matching "${searchQuery}"` : `Showing ${answers.length} of ${totalAnswers} answers`}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {loading && answers.length === 0 ? (
                        <div className="flex items-center justify-center h-48">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                                <p className="mt-2 text-muted-foreground">Loading answers...</p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {answers.map((answer) => (
                                <div key={answer._id} className="border rounded-lg p-6 hover:bg-muted/50 transition-colors">
                                    {/* Answer Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center space-x-3">
                                            <Image
                                                src={answer.author.picture}
                                                alt={answer.author.name}
                                                width={40}
                                                height={40}
                                                className="rounded-full"
                                            />
                                            <div>
                                                <div className="flex items-center space-x-2">
                                                    <h4 className="font-semibold">{answer.author.name}</h4>
                                                    <Badge variant="outline" className="text-xs">
                                                        <User className="h-3 w-3 mr-1" />
                                                        Author
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-muted-foreground">{answer.author.email}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    Answered {getTimestamp(new Date(answer.createdAt))}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <div className="flex items-center space-x-3 text-sm">
                                                <div className="flex items-center space-x-1 text-green-600">
                                                    <ThumbsUp className="h-4 w-4" />
                                                    <span>{answer.upvotesCount}</span>
                                                </div>
                                                {answer.downvotesCount > 0 && (
                                                    <div className="flex items-center space-x-1 text-red-600">
                                                        <ThumbsDown className="h-4 w-4" />
                                                        <span>{answer.downvotesCount}</span>
                                                    </div>
                                                )}
                                            </div>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleDeleteAnswer(answer)}
                                                disabled={deleting === answer._id}
                                            >
                                                {deleting === answer._id ? (
                                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                                ) : (
                                                    <Trash2 className="h-4 w-4" />
                                                )}
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Question Context */}
                                    <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                                        <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-1">
                                            <MessageSquare className="h-4 w-4" />
                                            <span>Answering question:</span>
                                        </div>
                                        <Link
                                            href={`/question/${answer.question._id}`}
                                            className="font-medium text-blue-600 hover:text-blue-800 transition-colors"
                                        >
                                            {answer.question.title}
                                        </Link>
                                    </div>

                                    {/* Answer Content */}
                                    <div className="prose prose-sm max-w-none">
                                        <div className="border rounded-lg p-4 bg-background">
                                            <h5 className="text-sm font-medium text-muted-foreground mb-2">Answer Content:</h5>
                                            {answer.content.length > 500 ? (
                                                <div>
                                                    <div className="text-sm text-muted-foreground mb-2">
                                                        {truncateContent(answer.content, 300)}
                                                    </div>
                                                    <details className="cursor-pointer">
                                                        <summary className="text-sm text-blue-600 hover:text-blue-800">
                                                            Show full answer
                                                        </summary>
                                                        <div className="mt-2 pt-2 border-t">
                                                            <ParseHTML data={answer.content} />
                                                        </div>
                                                    </details>
                                                </div>
                                            ) : (
                                                <ParseHTML data={answer.content} />
                                            )}
                                        </div>
                                    </div>

                                    {/* Answer Stats */}
                                    <div className="flex items-center justify-between mt-4 pt-4 border-t">
                                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                            <span>ID: {answer._id}</span>
                                            <span>Length: {answer.content.length} chars</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Badge
                                                variant={answer.upvotesCount > answer.downvotesCount ? "default" : "secondary"}
                                                className="text-xs"
                                            >
                                                Net Score: {answer.upvotesCount - answer.downvotesCount}
                                            </Badge>
                                            <Link href={`/question/${answer.question._id}#answer-${answer._id}`}>
                                                <Button variant="outline" size="sm">
                                                    View in Context
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {hasMore && (
                                <div className="text-center pt-6">
                                    <Button
                                        variant="outline"
                                        onClick={loadMore}
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                                                Loading...
                                            </>
                                        ) : (
                                            "Load More Answers"
                                        )}
                                    </Button>
                                </div>
                            )}

                            {answers.length === 0 && !loading && (
                                <div className="text-center py-12">
                                    <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold mb-2">No answers found</h3>
                                    <p className="text-muted-foreground">
                                        {searchQuery ? "Try adjusting your search criteria" : "No answers to display"}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default AnswerManagement;
