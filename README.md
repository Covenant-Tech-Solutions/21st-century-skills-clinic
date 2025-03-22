# 21st Century Skills Clinic, alias (Brain Bank): Technical Documentation

## Overview
21st Century Skills Clinic, alias (Brain Bank) is a platform that combines gamification, learning, and earning opportunities. It leverages modern technologies such as AI and Web3 to provide an engaging and rewarding experience for users.

---

## Frontend

### Framework
- **Next.js**: The frontend is built using Next.js, a React-based framework that supports server-side rendering and static site generation for optimal performance and SEO.

### Key Features
- **Dynamic Components**: Components like `IntroSlider`, `ShowScore`, and `TopHeader` are dynamically loaded using `next/dynamic` to improve performance.
- **Responsive Design**: The UI is fully responsive, ensuring compatibility across devices.
- **State Management**: Redux is used for global state management, handling user data, notifications, and system configurations.
- **Styling**: CSS-in-JS is used for component-level styling, ensuring modular and maintainable code.

### Libraries
- **React Icons**: For consistent and scalable icons.
- **Swiper.js**: For interactive sliders and carousels.
- **Ant Design**: For modals, dropdowns, and other UI components.
- **React Hot Toast**: For user notifications.

---

## Backend

### Framework
- **Node.js**: The backend is built using Node.js, providing a scalable and efficient runtime for handling API requests.
- **Express.js**: Used as the web framework for building RESTful APIs.

### Key Features
- **API Endpoints**: The backend exposes endpoints for user authentication, quiz data, leaderboard statistics, and wallet integration.
- **Database**: 
  - **MySQL**: Used for structured data storage, such as user profiles, quiz data, and transaction history.
  - **Firebase**: Used for Web2 authentication and real-time database capabilities.
- **Authentication**: Firebase Authentication is integrated for secure user login and registration.

### Integrations
- **Firebase**: For user authentication and real-time database capabilities.
- **Third-Party APIs**: APIs for fetching live contests, notifications, and other dynamic data.

---

## AI Integration

### Framework
- **Gemini APIs**: Integrated for generating personalized learning recommendations, career insights, and industry trend analysis.

### Key Features
- **Career Insights**: AI analyzes user preferences and quiz performance to provide career insights.
- **Skill Recommendations**: AI suggests skills to learn based on user interests and global trends.
- **Trend Analysis**: AI-powered algorithms analyze industry trends to keep users updated.

---

## Web3 Integration

### Framework
- **Web3.js**: Used for interacting with blockchain wallets and smart contracts.

### Key Features
- **Wallet Connection**: Users can connect their blockchain wallets (e.g., MetaMask) to claim skill points.
- **Skill Point Claiming**: Users sign a message to claim skill points, which are stored on the blockchain.
- **Credential Verification**: Organizations can verify user credentials and skill points by querying the blockchain.
- **LocalStorage**: Wallet addresses are saved in `localStorage` for seamless future interactions.

### Smart Contracts
- **Skill Points Contract**: 
  - Stores skill points associated with a user's wallet address.
  - Allows organizations to verify credentials by querying the blockchain.
  - Ensures transparency and immutability of skill-related data.
- **Transaction History**: All transactions are recorded on the blockchain for transparency.

---

## Push Notifications

### Framework
- **Firebase Cloud Messaging (FCM)**: Used for sending push notifications to users.

### Key Features
- **Real-Time Notifications**: Users receive real-time updates about contests, career insights, and platform announcements.
- **Subscription Management**: Users can subscribe to specific notifications, such as:
  - Emerging skills alerts.
  - Related job opportunities.
  - Trend shifts in their chosen career.
  - Community engagement updates.

---

## Career Insight Subscriptions

### Key Features
- **Personalized Insights**: Users receive tailored career insights based on their preferences and quiz performance.
- **Subscription Options**: Users can subscribe to:
  - Alerts for emerging skills in their chosen career.
  - Notifications about job opportunities and industry trends.
  - Updates on community discussions and engagements.
- **Delivery Channels**: Insights are delivered via email, push notifications, and in-app messages.

---

## Deployment

### Frontend
- **Vercel**: The frontend is deployed on Vercel for fast and reliable hosting.

### Backend
- **AWS**: The backend is hosted on AWS, leveraging services like EC2 and S3 for scalability and storage.

### CI/CD
- **GitHub Actions**: Automated workflows are set up for testing and deployment.

---

## Environment Variables

### `.env` File
The following environment variables are used:
```
NEXT_PUBLIC_BASE_URL="https://brainbank-admin.nexmatics.africa"
NEXT_PUBLIC_APP_WEB_URL="https://brainbank.builton.top"
NEXT_PUBLIC_END_POINT="/api/"
NEXT_PUBLIC_DEFAULT_COUNTRY="gh"
NEXT_PUBLIC_LANGUAGE_CONFIGURATION=['en']
NEXT_PUBLIC_DEFAULT_LANGUAGE="en"
NEXT_PUBLIC_SEO="false"
NEXT_PUBLIC_INSPECT_ELEMENT="false"
NEXT_PUBLIC_META_TITLE="Brain Bank : Play, Learn, and Win!"
NEXT_PUBLIC_META_DESCRIPTION="Your brain is a bank : Cash it out on Brain bank; a platform where you can play quizzes, learn, and earn money."
NEXT_PUBLIC_KEYWORDS="Brain Bank,Quiz,Questions,Answers,Earn,Solve to Earn,Learn to Earn"
NEXT_PUBLIC_DATA_AD_CLIENT="xxxxxxx"
NEXT_PUBLIC_DATA_AD_SLOT="xxxxxxxx"
NEXT_PUBLIC_DEMO="false"
```

---

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MetaMask or any Web3-compatible wallet

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/brain-bank.git
   ```
2. Navigate to the project directory:
   ```bash
   cd brain-bank
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Running Locally
1. Start the development server:
   ```bash
   npm run dev
   ```
2. Open your browser and navigate to `http://localhost:3000`.

---

## Contributing

### Guidelines
- Fork the repository and create a new branch for your feature or bug fix.
- Submit a pull request with a detailed description of your changes.

---

## License
This project is licensed under the MIT License. See the LICENSE file for details.

---

## Contact
For questions or support, please contact [odoijoshua55@gmail.com](mailto:odoijoshua55@gmail.com).