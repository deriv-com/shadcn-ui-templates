/**
 * Fibonacci Sequence Implementation
 * Multiple approaches for calculating Fibonacci numbers
 */

// 1. Recursive approach (inefficient for large numbers)
function fibonacciRecursive(n) {
  if (n <= 1) return n;
  return fibonacciRecursive(n - 1) + fibonacciRecursive(n - 2);
}

// 2. Memoized recursive approach (efficient)
function fibonacciMemoized(n, memo = {}) {
  if (n in memo) return memo[n];
  if (n <= 1) return n;
  
  memo[n] = fibonacciMemoized(n - 1, memo) + fibonacciMemoized(n - 2, memo);
  return memo[n];
}

// 3. Iterative approach (most efficient)
function fibonacciIterative(n) {
  if (n <= 1) return n;
  
  let a = 0, b = 1;
  for (let i = 2; i <= n; i++) {
    const temp = a + b;
    a = b;
    b = temp;
  }
  return b;
}

// 4. Generator function approach
function* fibonacciGenerator() {
  let a = 0, b = 1;
  while (true) {
    yield a;
    [a, b] = [b, a + b];
  }
}

// 5. Array-based approach
function fibonacciArray(n) {
  if (n <= 1) return n;
  
  const fib = [0, 1];
  for (let i = 2; i <= n; i++) {
    fib[i] = fib[i - 1] + fib[i - 2];
  }
  return fib[n];
}

// 6. Binet's formula (mathematical approach)
function fibonacciBinet(n) {
  const phi = (1 + Math.sqrt(5)) / 2;
  return Math.round(Math.pow(phi, n) / Math.sqrt(5));
}

// Utility function to measure performance
function measureTime(fn, n, label) {
  const start = performance.now();
  const result = fn(n);
  const end = performance.now();
  console.log(`${label}: F(${n}) = ${result} (${(end - start).toFixed(4)}ms)`);
  return result;
}

// Test functions
function testFibonacci() {
  console.log('=== Fibonacci Sequence Tests ===\n');
  
  const testCases = [0, 1, 5, 10, 20, 30, 40];
  
  testCases.forEach(n => {
    console.log(`\n--- Testing F(${n}) ---`);
    
    // Test recursive (only for small numbers)
    if (n <= 30) {
      measureTime(fibonacciRecursive, n, 'Recursive');
    }
    
    // Test memoized
    measureTime(fibonacciMemoized, n, 'Memoized');
    
    // Test iterative
    measureTime(fibonacciIterative, n, 'Iterative');
    
    // Test array-based
    measureTime(fibonacciArray, n, 'Array-based');
    
    // Test Binet's formula (only for small numbers due to precision)
    if (n <= 40) {
      measureTime(fibonacciBinet, n, 'Binet\'s formula');
    }
  });
}

// Generate Fibonacci sequence up to n terms
function generateSequence(n) {
  console.log(`\n=== First ${n} Fibonacci Numbers ===`);
  
  // Using generator
  const gen = fibonacciGenerator();
  for (let i = 0; i < n; i++) {
    console.log(`F(${i}) = ${gen.next().value}`);
  }
}

// Check if a number is Fibonacci
function isFibonacci(num) {
  const phi = (1 + Math.sqrt(5)) / 2;
  const a = Math.round(Math.sqrt(5 * num * num + 4));
  const b = Math.round(Math.sqrt(5 * num * num - 4));
  
  return (a * a === 5 * num * num + 4) || (b * b === 5 * num * num - 4);
}

// Find the closest Fibonacci number to a given number
function closestFibonacci(num) {
  if (num <= 1) return num;
  
  let a = 0, b = 1;
  while (b < num) {
    const temp = a + b;
    a = b;
    b = temp;
  }
  
  return (Math.abs(num - a) < Math.abs(num - b)) ? a : b;
}

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    fibonacciRecursive,
    fibonacciMemoized,
    fibonacciIterative,
    fibonacciGenerator,
    fibonacciArray,
    fibonacciBinet,
    generateSequence,
    isFibonacci,
    closestFibonacci,
    testFibonacci
  };
}

// Run tests if this file is executed directly
if (typeof require !== 'undefined' && require.main === module) {
  testFibonacci();
  generateSequence(15);
  
  console.log('\n=== Utility Functions ===');
  console.log(`Is 21 a Fibonacci number? ${isFibonacci(21)}`);
  console.log(`Is 22 a Fibonacci number? ${isFibonacci(22)}`);
  console.log(`Closest Fibonacci to 25: ${closestFibonacci(25)}`);
  console.log(`Closest Fibonacci to 30: ${closestFibonacci(30)}`);
}
