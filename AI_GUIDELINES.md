# **AI Coding Assistant Guidelines (AI_GUIDELINES.md)**

### **Human**
The human you are working with is not an experienced coder so you need to tell them what to do.
All codeing should be done on codespaces since the human coder has a very old apple mac.
The human code is requried to test chrome extension locally, which required use "git pull origin main" on their local vs code.  This means that you need to push code so they can use the chrome developer local load testing.
Please stop asking me and tell to do step by step, you know best steps and I am learning.

### **Purpose**
This document defines the rules, constraints, and best practices that AI coding assistants must follow when contributing to or modifying the code. It serves as the "source of truth" for AI assistants.

---

## **Project Context and Goals**

### **Project Type**
- **Chrome Extension Development**

### **Overview of the Chrome Extension**
This Chrome extension provides users with access to virtual assistants for task assistance. It supports:
- **Free Access**: No account creation required. Users can access one assistant with limited functionality.
- **Paid Subscription**: Unlocks all assistants, task sets, and additional features like data storage.

---

## **User Access Levels**

### **Free Users**
- **Access**: One assistant with predefined tasks.
- **Requirements**: No account creation needed.
- **Restrictions**: All other assistants are locked, with prompts to upgrade to the paid subscription.

### **Paid Subscribers**
- **Access**: All six assistants with full functionality.
- **Requirements**: Requires account creation and an active subscription.
- **Additional Features**:
  - Data storage for task history.
  - Persistent access to tasks and personalized settings.

---

## **Frontend Functionality and UI**

### **Main Window (800px Wide)**

#### **Home Page**
- **Layout**:
  - Displays a 2x3 grid of six assistant profiles.
  - Each profile includes:
    - **Profile Picture**: Visual representation of the assistant.
    - **Name**: The assistant’s name.
    - **Job Title**: Short descriptor of their role.
- **Interactivity**:
  - Free users: Access only the first assistant.
  - Locked assistants: Marked with a “Locked” label and upgrade prompt.
  - Clicking a profile navigates to the assistant’s **Task Page**.

#### **Task Page**
- **Header Section**:
  - Full-width card displaying:
    - Profile picture on the left.
    - Name, job title, and short description on the right.
- **Task Grid**:
  - 2x3 layout of task cards specific to the selected assistant.
  - Free users: Access one unlocked task set for the free assistant.
  - Clicking a task card opens the **Work Page**.

#### **Work Page**
- **Functionality**:
  - Users input text for the assistant to process.
  - Assistants respond with actionable, copyable output.
  - Interface is clean and optimized for task-focused interactions.

---

## **Backend Architecture**

### **Database: Supabase**
1. **User Management**:
   - Tracks subscription status (Free vs. Paid).
   - Paid user data includes:
     - Task history.
     - Assistant usage records.
2. **Assistant Metadata**:
   - Stores assistant profiles, tasks, and accessibility status.

### **API Integration: OpenAI**
- **Natural Language Processing**:
  - Powers assistant responses for tasks.
  - Handles user input dynamically and generates actionable outputs.

### **Extension Logic**
- **Free Users**:
  - No account required. Limited to one assistant.
- **Paid Users**:
  - Persistent data storage for task history and assistant interactions.

---

## **Key Features and Workflow**

### **Free Users**
- Access to one assistant upon installing the extension.
- Visible locked assistants and upgrade prompts encourage subscriptions.
- No account creation required for limited functionality.

### **Paid Subscribers**
- Account creation unlocks full access to:
  - All assistants.
  - Full task functionality.
  - History storage for past interactions.

### **Assistant Profiles and Tasks**
- Assistants are clearly defined by roles and tasks.
- Locked features highlight the benefits of upgrading.

### **Task Interaction**
- Intuitive UI for smooth, distraction-free input and output handling.
- Outputs are easy to copy for use in external applications.

---

## **Core Directives**

### **1. Resource Utilization**
- Refer to the **RESOURCE_REFERENCE.md** for guidance on technologies such as OpenAI, Supabase, and Chrome Extension development standards.
- Ensure information is used accurately to avoid errors caused by outdated knowledge.

### **2. Do Not Break Working Code**
- Preserve functionality of existing code unless explicitly instructed to modify it.
- Verify changes do not introduce regressions or new errors.

### **3. Adhere to the Defined Scope**
- Implement features and functionalities as outlined in the requirements.
- If requirements are unclear, ask for clarification instead of making assumptions.

### **4. Maintain Consistent Code Style**
- Use consistent formatting (e.g., 2 or 4 spaces for indentation).
- Name variables, functions, and classes descriptively.
- Prefer `const` and `let` over `var`, following modern JavaScript conventions.

### **5. Provide Incremental, Self-Contained Changes**
- Submit small, focused changes that achieve a specific goal.
- Avoid combining unrelated modifications in one update.

### **6. Document Key Logic and Changes**
- Add meaningful comments for complex or non-obvious logic.
- Briefly explain changes when recommending or implementing updates.
- For refactors, clarify what was changed and why.

### **7. Check for Errors and Consistency**
- Ensure code does not cause build or runtime errors.
- Account for edge cases and ensure graceful handling.

### **8. Ask for Clarification**
- Seek additional information if:
  - Requirements are unclear or contradictory.
  - The purpose or context of a code block is not well understood.

---

## **In Case of Uncertainty**
- **If Unsure About a Requirement**: Prompt the user for clarification.
- **If Unsure About Code Purpose**: Ask for context or review previously provided documentation.
