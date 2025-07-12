"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Eye, Search, Filter, Users, Calendar, TrendingUp } from "lucide-react";
import { getAdminUsers, adminDeleteUser, getUserDetailedAnalytics } from "@/lib/actions/admin.action";
import { useAuth } from "@clerk/nextjs";
import { toast } from "@/components/ui/use-toast";
import Link from "next/link";
import Image from "next/image";
import { getTimestamp } from "@/lib/utils";

interface User {
    _id: string;
    clerkId: string;
    name: string;
    username: string;
    email: string;
    picture: string;
    reputation: number;
    location?: string;
    joinedAt: string;
    questionsCount: number;
    answersCount: number;
    lastActive?: string;
}

const UserManagement = () => {
    const { userId } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("newest");
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [totalUsers, setTotalUsers] = useState(0);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [showUserDetails, setShowUserDetails] = useState(false);
    const [userDetails, setUserDetails] = useState<any>(null);

    const pageSize = 20;

    const fetchUsers = async (newPage = 1, newSearch = searchQuery, newSort = sortBy) => {
        try {
            setLoading(true);
            const result = await getAdminUsers({
                page: newPage,
                pageSize,
                searchQuery: newSearch || undefined,
                sortBy: newSort
            });

            if (newPage === 1) {
                setUsers(result.users);
            } else {
                setUsers(prev => [...prev, ...result.users]);
            }

            setHasMore(result.isNext);
            setTotalUsers(result.totalUsers);
            setPage(newPage);
        } catch (error) {
            console.error("Error fetching users:", error);
            toast({
                title: "Error",
                description: "Failed to fetch users",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userToDelete: User) => {
        if (!userId) return;

        const confirmDelete = window.confirm(
            `Are you sure you want to delete user "${userToDelete.name}"? This will permanently delete all their questions, answers, and related data.`
        );

        if (!confirmDelete) return;

        try {
            setDeleting(userToDelete.clerkId);
            await adminDeleteUser({
                userId: userToDelete.clerkId,
                adminClerkId: userId,
                path: "/admin"
            });

            setUsers(prev => prev.filter(u => u.clerkId !== userToDelete.clerkId));
            setTotalUsers(prev => prev - 1);

            toast({
                title: "Success",
                description: `User ${userToDelete.name} has been deleted successfully`,
                variant: "default",
            });
        } catch (error) {
            console.error("Error deleting user:", error);
            toast({
                title: "Error",
                description: "Failed to delete user",
                variant: "destructive",
            });
        } finally {
            setDeleting(null);
        }
    };

    const handleViewUserDetails = async (user: User) => {
        if (!userId) return;

        try {
            setShowUserDetails(true);
            setSelectedUser(user);
            setUserDetails(null);

            const details = await getUserDetailedAnalytics({
                userId: user.clerkId,
                adminClerkId: userId
            });

            setUserDetails(details);
        } catch (error) {
            console.error("Error fetching user details:", error);
            toast({
                title: "Error",
                description: "Failed to fetch user details",
                variant: "destructive",
            });
        }
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setPage(1);
        fetchUsers(1, query, sortBy);
    };

    const handleSort = (newSort: string) => {
        setSortBy(newSort);
        setPage(1);
        fetchUsers(1, searchQuery, newSort);
    };

    const loadMore = () => {
        if (hasMore && !loading) {
            fetchUsers(page + 1);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    if (showUserDetails && selectedUser) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-2xl font-bold">User Details</h3>
                        <p className="text-muted-foreground">Detailed analytics for {selectedUser.name}</p>
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => {
                            setShowUserDetails(false);
                            setSelectedUser(null);
                            setUserDetails(null);
                        }}
                    >
                        Back to Users
                    </Button>
                </div>

                {userDetails ? (
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* User Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Profile Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center space-x-4">
                                    <Image
                                        src={selectedUser.picture}
                                        alt={selectedUser.name}
                                        width={64}
                                        height={64}
                                        className="rounded-full"
                                    />
                                    <div>
                                        <h4 className="font-semibold">{selectedUser.name}</h4>
                                        <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                                        <p className="text-sm text-muted-foreground">@{selectedUser.username}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 pt-4">
                                    <div>
                                        <p className="text-sm font-medium">Reputation</p>
                                        <p className="text-2xl font-bold text-green-600">{selectedUser.reputation}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Joined</p>
                                        <p className="text-sm">{getTimestamp(new Date(selectedUser.joinedAt))}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Activity Stats */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Activity Statistics</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center p-4 border rounded-lg">
                                        <div className="text-2xl font-bold text-blue-600">{userDetails.stats.totalQuestions}</div>
                                        <div className="text-sm text-muted-foreground">Questions</div>
                                    </div>
                                    <div className="text-center p-4 border rounded-lg">
                                        <div className="text-2xl font-bold text-purple-600">{userDetails.stats.totalAnswers}</div>
                                        <div className="text-sm text-muted-foreground">Answers</div>
                                    </div>
                                    <div className="text-center p-4 border rounded-lg">
                                        <div className="text-2xl font-bold text-orange-600">{userDetails.stats.totalViews}</div>
                                        <div className="text-sm text-muted-foreground">Total Views</div>
                                    </div>
                                    <div className="text-center p-4 border rounded-lg">
                                        <div className="text-2xl font-bold text-green-600">
                                            {userDetails.stats.avgUpvotesPerQuestion.toFixed(1)}
                                        </div>
                                        <div className="text-sm text-muted-foreground">Avg Upvotes/Q</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Voting Activity */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Voting Activity</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span>Questions Upvoted</span>
                                        <Badge variant="secondary">{userDetails.votingActivity.questionsUpvoted}</Badge>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Questions Downvoted</span>
                                        <Badge variant="secondary">{userDetails.votingActivity.questionsDownvoted}</Badge>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Answers Upvoted</span>
                                        <Badge variant="secondary">{userDetails.votingActivity.answersUpvoted}</Badge>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Answers Downvoted</span>
                                        <Badge variant="secondary">{userDetails.votingActivity.answersDownvoted}</Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Reputation Breakdown */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Reputation Sources</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span>Questions Created</span>
                                        <Badge variant="outline">+{userDetails.reputationSources.questionsCreated}</Badge>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Answers Created</span>
                                        <Badge variant="outline">+{userDetails.reputationSources.answersCreated}</Badge>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Questions Upvoted</span>
                                        <Badge variant="outline">+{userDetails.reputationSources.questionsUpvoted}</Badge>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Answers Upvoted</span>
                                        <Badge variant="outline">+{userDetails.reputationSources.answersUpvoted}</Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-48">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                            <p className="mt-2 text-muted-foreground">Loading user details...</p>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-2xl font-bold">User Management</h3>
                    <p className="text-muted-foreground">Manage platform users and their content</p>
                </div>
                <Badge variant="outline" className="text-lg px-3 py-1">
                    {totalUsers.toLocaleString()} Total Users
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
                                    placeholder="Search by name, email, or username..."
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
                                <SelectItem value="reputation">Highest Reputation</SelectItem>
                                <SelectItem value="name">Name A-Z</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Users List */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Platform Users
                    </CardTitle>
                    <CardDescription>
                        {searchQuery ? `Found ${users.length} users matching "${searchQuery}"` : `Showing ${users.length} of ${totalUsers} users`}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {loading && users.length === 0 ? (
                        <div className="flex items-center justify-center h-48">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                                <p className="mt-2 text-muted-foreground">Loading users...</p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {users.map((user) => (
                                <div key={user._id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <Image
                                                src={user.picture}
                                                alt={user.name}
                                                width={48}
                                                height={48}
                                                className="rounded-full"
                                            />
                                            <div>
                                                <div className="flex items-center space-x-2">
                                                    <h4 className="font-semibold">{user.name}</h4>
                                                    <Badge variant="secondary">{user.reputation} rep</Badge>
                                                </div>
                                                <p className="text-sm text-muted-foreground">{user.email}</p>
                                                <p className="text-sm text-muted-foreground">@{user.username}</p>
                                                <div className="flex items-center space-x-4 mt-1">
                                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                        <Calendar className="h-3 w-3" />
                                                        Joined {getTimestamp(new Date(user.joinedAt))}
                                                    </span>
                                                    {user.location && (
                                                        <span className="text-xs text-muted-foreground">{user.location}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <div className="text-right text-sm">
                                                <div className="font-medium">{user.questionsCount} questions</div>
                                                <div className="text-muted-foreground">{user.answersCount} answers</div>
                                                {user.lastActive && (
                                                    <div className="text-xs text-muted-foreground">
                                                        Last active: {getTimestamp(new Date(user.lastActive))}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex flex-col space-y-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleViewUserDetails(user)}
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => handleDeleteUser(user)}
                                                    disabled={deleting === user.clerkId}
                                                >
                                                    {deleting === user.clerkId ? (
                                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                                    ) : (
                                                        <Trash2 className="h-4 w-4" />
                                                    )}
                                                </Button>
                                            </div>
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
                                            "Load More Users"
                                        )}
                                    </Button>
                                </div>
                            )}

                            {users.length === 0 && !loading && (
                                <div className="text-center py-12">
                                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold mb-2">No users found</h3>
                                    <p className="text-muted-foreground">
                                        {searchQuery ? "Try adjusting your search criteria" : "No users to display"}
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

export default UserManagement;
