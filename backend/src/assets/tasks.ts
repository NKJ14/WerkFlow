interface Task{
    id: number,
    title: string,
    description: string,
    category: string,
    priority: string,
    status: string,
    dueDate: Date,
    comments:{
        id: number,
        text: string,
        author: string,
    }[]
}
/** how does it look? Eg:-
 * {
  "id": "1",
  "title": "Complete Project Proposal",
  "description": "Write and submit the project proposal for approval.",
  "category": "Work",
  "priority": "High",
  "status": "To Do",
  "dueDate": "2022-02-15",
  "comments": [
    {
      "id": "comment1",
      "text": "Make sure to include the budget estimates.",
      "author": "John Doe",
    },
    {
      "id": "comment2",
      "text": "I can help with the market research part.",
      "author": "Jane Smith",
    }
  ]
}
 */
export default Task