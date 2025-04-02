const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Define the .env file path
const envPath = path.join(__dirname, '..', '.env.local');

console.log('🔧 Procotech Environment Setup 🔧');
console.log('--------------------------------');
console.log('This script will help you set up your environment variables for Supabase integration.');
console.log('You can find these values in your Supabase dashboard: https://app.supabase.com');
console.log('--------------------------------\n');

const questions = [
  {
    name: 'NEXT_PUBLIC_SUPABASE_URL',
    question: 'Enter your Supabase URL (e.g., https://yourproject.supabase.co):',
    validate: (value) => {
      try {
        new URL(value);
        return true;
      } catch (error) {
        return 'Please enter a valid URL';
      }
    }
  },
  {
    name: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    question: 'Enter your Supabase Anon Key:',
    validate: (value) => value.length > 0 ? true : 'This field is required'
  },
  {
    name: 'SUPABASE_SERVICE_ROLE_KEY',
    question: 'Enter your Supabase Service Role Key:',
    validate: (value) => value.length > 0 ? true : 'This field is required'
  }
];

// Check if the .env.local file already exists
let existingEnv = {};
if (fs.existsSync(envPath)) {
  console.log('Found existing .env.local file. Will update existing values.\n');
  const envFile = fs.readFileSync(envPath, 'utf8');
  
  // Parse existing environment variables
  envFile.split('\n').forEach(line => {
    if (line && !line.startsWith('#')) {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length) {
        existingEnv[key.trim()] = valueParts.join('=').trim();
      }
    }
  });
}

// Keep track of collected answers
const answers = {};

// Ask questions sequentially
function askQuestion(index) {
  if (index >= questions.length) {
    writeEnvFile();
    return;
  }

  const currentQuestion = questions[index];
  const existingValue = existingEnv[currentQuestion.name];
  
  const promptText = existingValue 
    ? `${currentQuestion.question} (current: ${existingValue})\nPress Enter to keep current value or type a new one: `
    : `${currentQuestion.question} `;

  rl.question(promptText, (answer) => {
    // Use existing value if user just presses Enter
    const value = answer.trim() || existingValue || '';
    
    // Validate the answer
    const validationResult = currentQuestion.validate(value);
    if (validationResult !== true) {
      console.log(`Error: ${validationResult}`);
      // Ask the same question again
      askQuestion(index);
      return;
    }
    
    answers[currentQuestion.name] = value;
    askQuestion(index + 1);
  });
}

// Write the .env.local file with collected answers
function writeEnvFile() {
  // Combine existing environment variables with new answers
  const envVars = { ...existingEnv, ...answers };
  
  // Ensure NEXT_PUBLIC_SITE_URL is set
  if (!envVars.NEXT_PUBLIC_SITE_URL) {
    envVars.NEXT_PUBLIC_SITE_URL = 'http://localhost:3000';
  }
  
  // Format the env file content
  let envContent = '# Supabase - Configuration\n';
  Object.entries(envVars).forEach(([key, value]) => {
    // Group variables logically
    if (key === 'NEXT_PUBLIC_SITE_URL' && !envContent.includes('# Other environment variables')) {
      envContent += '\n# Other environment variables\n';
    }
    envContent += `${key}=${value}\n`;
  });
  
  // Write to file
  fs.writeFileSync(envPath, envContent);
  
  console.log('\n✅ Environment variables have been written to .env.local');
  console.log('You can now start your development server with:');
  console.log('  npm run dev');
  
  rl.close();
}

// Start asking questions
askQuestion(0); 