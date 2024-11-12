# DDC Project Manager

DDC Project Manager is a web application built with Next.js and Supabase, designed to help teams manage their projects efficiently. The application leverages the power of Onyx, a decentralized autonomous organization (DAO), to provide a transparent and democratic decision-making process.

## Features

- **Project Management**: Create, update, and delete projects with ease.
- **User Authentication**: Secure authentication using Supabase.
- **Real-time Updates**: Keep track of project status and updates in real-time.
- **Decentralized Governance**: Participate in the decision-making process through Onyx DAO.
- **Export Data**: Export project data to Excel for offline use.

## Getting Started

### Prerequisites

- Node.js
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/your-username/ddc-project-manager.git
   cd ddc-project-manager
   ```

2. Install dependencies:

   ```sh
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:

   Create a `.env.local` file in the root directory and add your Supabase credentials:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. Run the development server:

   ```sh
   npm run dev
   # or
   yarn dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

- **Authentication**: Sign in to access your projects.
- **Project Management**: Use the dashboard to manage your projects.
- **Governance**: Participate in the Onyx DAO for project-related decisions.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
