# Stack Overflow Clone - Comprehensive Feature & Endpoint Documentation

## 🏗️ Architecture Overview
- **Frontend**: Next.js with TypeScript
- **Backend**: Server Actions (Next.js)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Clerk
- **AI Integration**: Groq API (Llama model)
- **External APIs**: JSearch for job listings

## 📊 Database Models

### 1. User Model (`/database/user.model.ts`)
**Fields:**
- `clerkId`: String (required) - Clerk authentication ID
- `name`: String (required) - User's display name
- `username`: String (unique, sparse) - Username (optional)
- `email`: String (required, unique) - User's email
- `password`: String (optional) - Password field
- `bio`: String (optional) - User biography
- `picture`: String (required) - Profile picture URL
- `location`: String (optional) - User's location
- `portfolioWebsite`: String (optional) - Portfolio URL
- `reputation`: Number (default: 0) - User reputation points
- `saved`: [ObjectId] - Array of saved question IDs
- `joinedAt`: Date (default: now) - Registration timestamp

**What it stores:**
- User profile information
- Authentication data
- Reputation scores
- Saved questions references

### 2. Question Model (`/database/question.model.ts`)
**Fields:**
- `title`: String (required) - Question title
- `content`: String (required) - Question body/content
- `tags`: [ObjectId] - Array of tag references
- `views`: Number (default: 0) - View count
- `upvotes`: [ObjectId] - Array of user IDs who upvoted
- `downvotes`: [ObjectId] - Array of user IDs who downvoted
- `author`: ObjectId (required) - Reference to User who asked
- `answers`: [ObjectId] - Array of answer references
- `createdAt`: Date (default: now) - Creation timestamp

**What it stores:**
- Question content and metadata
- Voting information
- View statistics
- Relationships to users, tags, and answers

### 3. Answer Model (`/database/answer.model.ts`)
**Fields:**
- `author`: ObjectId (required) - Reference to User who answered
- `question`: ObjectId (required) - Reference to parent Question
- `content`: String (required) - Answer content
- `upvotes`: [ObjectId] - Array of user IDs who upvoted
- `downvotes`: [ObjectId] - Array of user IDs who downvoted
- `createdAt`: Date (default: now) - Creation timestamp

**What it stores:**
- Answer content
- Voting data
- Relationships to users and questions

### 4. Tag Model (`/database/tag.model.ts`)
**Fields:**
- `name`: String (required, unique) - Tag name
- `description`: String (required) - Tag description
- `questions`: [ObjectId] - Array of question references
- `followers`: [ObjectId] - Array of user references who follow tag
- `createdOn`: Date (default: now) - Creation timestamp

**What it stores:**
- Tag metadata
- Question associations
- Follower relationships

### 5. Interaction Model (`/database/interaction.model.ts`)
**Fields:**
- `user`: ObjectId (required) - Reference to User
- `action`: String (required) - Action type (view, ask_question, answer, etc.)
- `question`: ObjectId (optional) - Reference to Question
- `answer`: ObjectId (optional) - Reference to Answer
- `tags`: [ObjectId] - Array of tag references
- `createdAt`: Date (default: now) - Interaction timestamp

**What it stores:**
- User activity tracking
- Interaction history for recommendations
- Analytics data

## 🔧 User Management Features

### User Actions (`/lib/actions/user.action.ts`)

#### 1. `getUserById(params: GetUserByIdParams)`
**Use Case:** Fetch user by Clerk ID
**Parameters:** `{ userId: string }`
**Returns:** User object
**Database Operations:** Read from User collection

#### 2. `createUser(userData: CreateUserParams)`
**Use Case:** Create new user account (webhook triggered)
**Parameters:** User registration data
**Database Operations:** 
- Create new User document
- Add 50 reputation points for new user
**Reputation System:** +50 for account creation

#### 3. `updateUser(updatedData: UpdateUserParams)`
**Use Case:** Update user profile information
**Parameters:** `{ clerkId, path, updateData }`
**Database Operations:** Update User document
**Cache:** Revalidates path

#### 4. `deleteUser(params: DeleteUserParams)`
**Use Case:** Delete user account and all associated data
**Parameters:** `{ clerkId: string }`
**Database Operations:** 
- Delete User document
- Delete all user's Questions
- Cascade delete answers, comments, etc.

#### 5. `getAllUsers(params: GetAllUsersParams)`
**Use Case:** Get paginated list of users with search/filter
**Parameters:** `{ searchQuery?, filter?, page?, pageSize? }`
**Features:**
- Search by name/username
- Filter by: new_users, old_users, top_contributors
- Pagination support
**Returns:** `{ users, isNext }`

#### 6. `toggleSaveQuestion(params: ToggleSaveQuestionParams)`
**Use Case:** Save/unsave questions to user profile
**Parameters:** `{ questionId, userId, path }`
**Reputation System:** 
- +5/-5 to question author
- +5/-5 to user (if not own question)
**Database Operations:** Update User.saved array

#### 7. `getSavedQuestions(params: GetSavedQuestionParams)`
**Use Case:** Get user's saved questions with pagination
**Parameters:** `{ clerkId, searchQuery?, filter?, page?, pageSize? }`
**Features:**
- Search within saved questions
- Filter by: most_recent, oldest, most_voted, most_viewed, most_answered
- Pagination support

#### 8. `getUserInfo(params: GetUserByIdParams)`
**Use Case:** Get comprehensive user statistics for profile
**Returns:**
- Total questions count
- Total answers count
- Question upvotes aggregate
- Answer upvotes aggregate
- Question views aggregate
- Badge calculations
- User reputation

#### 9. `getUserQuestions(params: GetUserStatsParams)`
**Use Case:** Get user's questions with pagination
**Parameters:** `{ userId, page?, pageSize? }`
**Features:** Sorted by creation date, views, upvotes

#### 10. `getUserAnswers(params: GetUserStatsParams)`
**Use Case:** Get user's answers with pagination
**Parameters:** `{ userId, page?, pageSize? }`
**Features:** Sorted by creation date, upvotes

## 🏷️ Tag Management Features

### Tag Actions (`/lib/actions/tag.action.ts`)

#### 1. `getTopInteractedTags(params: GetTopInteractedTagsParams)`
**Use Case:** Get tags user interacts with most (currently mock data)
**Status:** Placeholder implementation
**Future:** Will use Interaction model for real data

#### 2. `getAllTags(params: GetAllTagsParams)`
**Use Case:** Get paginated list of all tags
**Parameters:** `{ searchQuery?, filter?, page?, pageSize? }`
**Features:**
- Search by tag name
- Filter by: popular, recent, old, name
- Pagination support

#### 3. `getTagById(params: GetTagByIdParams)`
**Use Case:** Get specific tag by ID
**Parameters:** `{ tagId: string }`

#### 4. `getQuestionByTagId(params: GetQuestionByTagIdParams)`
**Use Case:** Get questions associated with specific tag
**Parameters:** `{ tagId, searchQuery?, page?, pageSize? }`
**Features:**
- Search within tag's questions
- Pagination support
- Returns tag name and questions

#### 5. `getPopularTags()`
**Use Case:** Get top 5 most popular tags for sidebar
**Database Operations:** Aggregation pipeline to count questions per tag
**Returns:** Tags sorted by question count

## ❓ Question Management Features

### Question Actions (`/lib/actions/question.action.ts`)

#### 1. `createQuestion(params: CreateQuestionParams)`
**Use Case:** Create new question
**Parameters:** `{ title, content, tags, author, path }`
**Database Operations:**
- Create Question document
- Create/update Tag documents
- Create Interaction record
**Reputation System:** +10 to author
**Features:**
- Automatic tag creation/association
- Interaction tracking

#### 2. `getQuestions(params: GetQuestionsParams)`
**Use Case:** Get paginated list of questions for home page
**Parameters:** `{ searchQuery?, filter?, page?, pageSize? }`
**Features:**
- Search by title/content
- Filter by: newest, frequent, unanswered
- Pagination support
- Populates author and tags

#### 3. `getQuestionById(params: GetQuestionByIdParams)`
**Use Case:** Get specific question for detail page
**Parameters:** `{ questionId: string }`
**Returns:** Populated question with author and tags

#### 4. `upvoteQuestion(params: QuestionVoteParams)`
**Use Case:** Upvote/remove upvote from question
**Parameters:** `{ userId, questionId, hasupVoted, hasdownVoted, path }`
**Reputation System:**
- Voter: +1/-1 reputation
- Author: +10/-10 reputation (if not self-vote)
**Features:** Handles vote switching

#### 5. `downvoteQuestion(params: QuestionVoteParams)`
**Use Case:** Downvote/remove downvote from question
**Parameters:** `{ userId, questionId, hasdownVoted, hasupVoted, path }`
**Reputation System:**
- Voter: +2/-2 reputation
- Author: +10/-10 reputation (minimum 0)
**Features:** Prevents negative reputation

#### 6. `deleteQuestion(params: DeleteQuestionParams)`
**Use Case:** Delete question and cascade delete related data
**Parameters:** `{ questionId, path }`
**Database Operations:**
- Delete Question document
- Delete associated Answers
- Delete Interactions
- Update Tag question arrays
**Reputation System:** -10 to author

#### 7. `editQuestion(params: EditQuestionParams)`
**Use Case:** Edit existing question
**Parameters:** `{ content, path, title, questionId }`
**Features:** Updates title and content only

#### 8. `getHotQuestions()`
**Use Case:** Get trending questions for sidebar
**Sorting:** By views and upvotes (descending)
**Limit:** 5 questions

#### 9. `getRecommendedQuestions(params: RecommendedParams)`
**Use Case:** Get personalized question recommendations
**Parameters:** `{ userId, page?, pageSize?, searchQuery? }`
**Algorithm:**
- Based on user's interaction tags
- Excludes user's own questions
- Search capability
- Pagination support

## 💬 Answer Management Features

### Answer Actions (`/lib/actions/answer.action.ts`)

#### 1. `createAnswer(params: CreateAnswerParams)`
**Use Case:** Create new answer to question
**Parameters:** `{ content, question, author, path }`
**Database Operations:**
- Create Answer document
- Update Question.answers array
- Create Interaction record
**Reputation System:** +10 to author (if not self-answer)

#### 2. `getAnswers(params: GetAnswersParams)`
**Use Case:** Get paginated answers for question
**Parameters:** `{ questionId, sortBy?, page?, pageSize? }`
**Features:**
- Sort by: highestUpvotes, lowestUpvotes, recent, old
- Pagination support
- Populates author information

#### 3. `upvoteAnswer(params: AnswerVoteParams)`
**Use Case:** Upvote/remove upvote from answer
**Parameters:** `{ answerId, hasdownVoted, hasupVoted, path, userId }`
**Reputation System:**
- Voter: +2/-2 reputation
- Author: +10/-10 reputation (if not self-vote)

#### 4. `downvoteAnswer(params: AnswerVoteParams)`
**Use Case:** Downvote/remove downvote from answer
**Parameters:** `{ answerId, hasdownVoted, hasupVoted, path, userId }`
**Reputation System:**
- Voter: +2/-2 reputation
- Author: +10/-10 reputation (minimum 0)

#### 5. `deleteAnswer(params: DeleteAnswerParams)`
**Use Case:** Delete answer and related data
**Parameters:** `{ answerId, path }`
**Database Operations:**
- Delete Answer document
- Update Question.answers array
- Delete Interactions

## 🔍 Search & Interaction Features

### General Actions (`/lib/actions/general.action.ts`)

#### 1. `globalSearch(params: SearchParams)`
**Use Case:** Global search across all content types
**Parameters:** `{ query, type? }`
**Features:**
- Search across: questions, users, answers, tags
- Type-specific search or global search
- Returns formatted results with titles and IDs

### Interaction Actions (`/lib/actions/interaction.action.ts`)

#### 1. `viewQuestion(params: ViewQuestionParams)`
**Use Case:** Track question views and user interactions
**Parameters:** `{ questionId, userId? }`
**Database Operations:**
- Increment Question.views
- Create Interaction record (if user logged in)
**Features:** Prevents duplicate view tracking per user

## 💼 Job Integration Features

### Job Actions (`/lib/actions/job.action.ts`)

#### 1. `getJobs(params: GetJobsParams)`
**Use Case:** Get job listings from static JSON data
**Parameters:** `{ page?, pageSize?, filter?, location?, remote?, wage?, skills?, searchQuery? }`
**Data Source:** `/content/jsearch.json`
**Features:**
- Search by job title
- Filter by location, remote work, salary, skills
- Employment type filtering: fulltime, parttime, contractor, intern
- Pagination support

#### 2. `getCountryFilters()`
**Use Case:** Get country options for job filtering
**Data Source:** `/content/countries.json`
**Returns:** Country names and codes

## 🌐 API Endpoints

### Webhook Endpoint (`/app/api/webhook/route.ts`)

#### `POST /api/webhook`
**Use Case:** Handle Clerk authentication webhooks
**Events Handled:**
- `user.created`: Create user in MongoDB with fallback username
- `user.updated`: Update user information in MongoDB  
- `user.deleted`: Delete user and cascade delete related data
**Features:**
- Automatic username generation from email
- Error handling and validation
- Reputation initialization (+50 for new users)

### AI Chat Endpoint (`/app/api/chatgpt/route.ts`)

#### `POST /api/chatgpt`
**Use Case:** Get AI-generated answers using Groq API
**Parameters:** `{ question: string }`
**AI Model:** llama-3.3-70b-versatile
**Returns:** AI-generated response
**Features:** Error handling for API failures

## 🎯 Reputation System

### Point Values:
- **Account Creation:** +50 points
- **Question Creation:** +10 points
- **Answer Creation:** +10 points (if not self-answer)
- **Question Upvote:** +10 to author, +1 to voter
- **Question Downvote:** -10 to author, +2 to voter
- **Answer Upvote:** +10 to author, +2 to voter
- **Answer Downvote:** -10 to author, +2 to voter
- **Save Question:** +5 to author, +5 to saver
- **Unsave Question:** -5 to author, -5 to saver
- **Question Deletion:** -10 to author

### Rules:
- Self-voting doesn't affect reputation
- Reputation cannot go below 0
- Different point values for different actions

## 🏆 Badge System

### Badge Criteria Types:
- `QUESTION_COUNT`: Based on number of questions asked
- `ANSWER_COUNT`: Based on number of answers provided
- `QUESTION_UPVOTES`: Based on upvotes received on questions
- `ANSWER_UPVOTES`: Based on upvotes received on answers
- `TOTAL_VIEWS`: Based on total views on user's content per User Account

## 📱 Frontend Features

### Pages:
- **Question Detail Page:** `/question/[id]` - Displays question with answers, voting, and answer form
- **User Profile Pages:** Individual user statistics and content
- **Tag Pages:** Questions filtered by specific tags
- **Search Results:** Global search across all content
- **Job Listings:** External job integration

### Components:
- **Voting System:** Upvote/downvote with reputation tracking
- **Answer Form:** Rich text editor for creating answers
- **Metrics Display:** Views, answers, creation time
- **Tag Rendering:** Clickable tags with styling
- **HTML Parsing:** Safe rendering of user-generated content

## 🔄 Data Flow

### Question Creation Flow:
1. User submits question form
2. `createQuestion` action processes data
3. Question document created
4. Tags created/updated with question reference
5. Interaction record created
6. User reputation increased (+10)
7. Page revalidated

### Voting Flow:
1. User clicks vote button
2. Vote action processes current state
3. Database updated with new vote state
4. Reputation adjustments applied
5. Page revalidated with new data

### User Registration Flow:
1. Clerk webhook triggered on user creation
2. Webhook processes user data
3. MongoDB user created with fallback username
4. Initial reputation assigned (+50)
5. User ready for platform interaction

## 🚀 Potential Improvements

### Current Limitations:
- Tag interactions are mocked (needs real implementation)
- Job data is static (could integrate live APIs)
- Comment system not implemented
- Email notifications not implemented
- Advanced search filters limited

### Scalability Considerations:
- Pagination implemented throughout
- Database indexing on frequently queried fields
- Aggregation pipelines for complex queries
- Caching with Next.js revalidation

### Security Features:
- Server-side validation
- Clerk authentication integration
- Webhook signature verification
- XSS protection with HTML parsing
- Rate limiting (could be added)

## 📈 Analytics & Tracking

### Interaction Tracking:
- Question views
- User actions (ask, answer, vote, view)
- Tag associations
- Recommendation system data

### Metrics Available:
- User reputation scores
- Question/answer counts
- Vote counts and ratios
- View statistics
- Badge progression
- User activity patterns

This comprehensive system provides a fully-featured Stack Overflow clone with user management, content creation, voting, search, AI integration, and job listings functionality.
