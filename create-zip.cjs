const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

// Create a file to stream archive data to
const output = fs.createWriteStream('personal-finance-app.zip');
const archive = archiver('zip', {
  zlib: { level: 9 } // Sets the compression level
});

// Listen for all archive data to be written
output.on('close', function() {
  console.log('ZIP file created successfully!');
  console.log('Total bytes: ' + archive.pointer());
});

// Good practice to catch warnings (ie stat failures and other non-blocking errors)
archive.on('warning', function(err) {
  if (err.code === 'ENOENT') {
    console.warn(err);
  } else {
    throw err;
  }
});

// Good practice to catch this error explicitly
archive.on('error', function(err) {
  throw err;
});

// Pipe archive data to the file
archive.pipe(output);

// Add files to the archive
const filesToInclude = [
  'index.html',
  'package.json',
  'package-lock.json',
  'tsconfig.json',
  'tsconfig.app.json',
  'tsconfig.node.json',
  'vite.config.ts',
  'tailwind.config.js',
  'postcss.config.js',
  'eslint.config.js',
  'src/main.tsx',
  'src/App.tsx',
  'src/index.css',
  'src/vite-env.d.ts',
  'src/types/finance.ts',
  'src/hooks/useToast.ts',
  'src/hooks/useLocalStorage.ts',
  'src/hooks/useFinance.ts',
  'src/utils/dateUtils.ts',
  'src/components/Navigation.tsx',
  'src/components/Dashboard.tsx',
  'src/components/AddExpense.tsx',
  'src/components/BudgetPlanning.tsx',
  'src/components/Reports.tsx',
  'src/components/Settings.tsx',
  'src/components/ExpenseList.tsx',
  'src/components/Toast.tsx',
  'src/components/ToastContainer.tsx',
  'src/components/ConfirmationModal.tsx'
];

// Add each file to the archive
filesToInclude.forEach(file => {
  if (fs.existsSync(file)) {
    archive.file(file, { name: file });
  }
});

// Add .gitignore if it exists
if (fs.existsSync('.gitignore')) {
  archive.file('.gitignore', { name: '.gitignore' });
}

// Finalize the archive
archive.finalize();