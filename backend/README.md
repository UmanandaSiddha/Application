# Voolata Backend

## Features

- User authentication
- CRUD operations
- JWT-based authorization
- MongoDB integration

## Installation

1. Clone the repo:

   ```bash
   git clone https://github.com/yourusername/project.git
   ```
   \# Database Schema ## Users | Field | Type | Constraints | |----------------|--------------|-------------------| | id | ObjectId | Primary Key | | name | String | Required | | email | String | Unique, Required | | password | String | Required | ## Posts | Field | Type | Constraints | |----------------|--------------|-------------------| | id | ObjectId | Primary Key | | title | String | Required | | content | String | Required | | authorId | ObjectId | References Users |