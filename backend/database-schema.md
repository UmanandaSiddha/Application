# Database Schema

 

## Users

| Field | Type | Constraints |
| --- | --- | --- |
| id | ObjectId | Primary Key |
| name | String | Required |
| email | String | Unique, Required |
| password | String | Required |

## Posts

| Field | Type | Constraints |
| --- | --- | --- |
| id | ObjectId | Primary Key |
| title | String | Required |
| content | String | Required |
| authorId | ObjectId | References Users |
