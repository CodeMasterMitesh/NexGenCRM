# NexGenCRM

CRM Software for the Next Generation of Businesses
Overview
NexGenCRM is a cutting-edge Customer Relationship Management (CRM) software designed to help businesses streamline their customer interactions, manage sales pipelines, and enhance customer satisfaction. Built with modern technologies, NexGenCRM offers a user-friendly interface and powerful features to meet the needs of businesses of all sizes.

## Features
- **Login user/password**: Secure authentication system for user access.
- **Open Source**: Fully open-source software, allowing for customization and community contributions.
- **Modern Technology Stack**: Built using the latest web technologies to ensure speed, reliability, and scalability.
- **User-Friendly Interface**: Intuitive design that makes it easy for users to navigate and utilize all features effectively.
- **Contact Management**: Easily store and manage customer information, including contact details, communication history, and social media profiles.
- **Sales Pipeline**: Visualize and manage your sales process with customizable pipelines, stages, and deal tracking.
- **follow-up Reminders**: Set automated reminders for follow-ups to ensure no lead is forgotten.
- **Email Integration**: Sync with popular email services to send, receive, and track emails directly within the CRM.
- **Task Automation**: Automate repetitive tasks such as follow-up emails, reminders, and notifications to improve efficiency.
- **Analytics & Reporting**: Gain insights into your sales performance with detailed reports and analytics dashboards.
- **Integration**: Seamlessly integrate with popular tools such as email clients, marketing platforms, and e-commerce systems.
- **Mobile Access**: Access your CRM on the go with our mobile app, available for both iOS and Android devices. 
- **Customizable Workflows**: Tailor the CRM to fit your business processes with customizable workflows and fields.
- **Collaboration Tools**: Enhance team collaboration with shared calendars, notes, and communication channels.


## Backend Mongodb Collections
- **users**: Stores user information, including login credentials and profile details and associated users table but type == employee.
- **users**: Contains customer contact information and mobile numbers and email and other details and associated users table but type == 'customer'.
- **Users**: Manages sales pipeline data, including deal stages, values, and associated users table but type == lead.
- **lead_followups**: Stores follow-up reminders, including reminder details and associated users table but type == lead.
- **lead_sources**: Contains information about lead sources, including source names and associated lead_source table.
- **email_templates**: Stores email templates for automated communication, including template content and associated email_templates.
- **tasks**: Manages automated tasks, including task details and associated tasks.