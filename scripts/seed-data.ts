export interface SeedProblem {
  title: string;
  description: string;
  pseudocode: string;
}

// ---------------------------------------------------------------------------
// SEQUENCE - straight-line logic, no branching or looping (34 problems)
// ---------------------------------------------------------------------------
export const sequenceProblems: SeedProblem[] = [
  {
    title: "Add Two Numbers",
    description: "Read two numbers from the user and display their sum.",
    pseudocode: `START
INPUT a, b
sum = a + b
OUTPUT sum
END`,
  },
  {
    title: "Subtract Two Numbers",
    description: "Read two numbers and display the result of subtracting the second from the first.",
    pseudocode: `START
INPUT a, b
difference = a - b
OUTPUT difference
END`,
  },
  {
    title: "Multiply Two Numbers",
    description: "Read two numbers from the user and display their product.",
    pseudocode: `START
INPUT a, b
product = a * b
OUTPUT product
END`,
  },
  {
    title: "Divide Two Numbers",
    description: "Read two numbers and display the result of dividing the first by the second.",
    pseudocode: `START
INPUT a, b
quotient = a / b
OUTPUT quotient
END`,
  },
  {
    title: "Average of Two Numbers",
    description: "Read two numbers and display their average.",
    pseudocode: `START
INPUT a, b
average = (a + b) / 2
OUTPUT average
END`,
  },
  {
    title: "Average of Three Numbers",
    description: "Read three numbers and display their average.",
    pseudocode: `START
INPUT a, b, c
average = (a + b + c) / 3
OUTPUT average
END`,
  },
  {
    title: "Swap Two Variables",
    description: "Read two values and display them after swapping their positions, using a temporary variable.",
    pseudocode: `START
INPUT a, b
temp = a
a = b
b = temp
OUTPUT a, b
END`,
  },
  {
    title: "Celsius to Fahrenheit",
    description: "Read a temperature in Celsius and convert it to Fahrenheit.",
    pseudocode: `START
INPUT celsius
fahrenheit = (celsius * 9 / 5) + 32
OUTPUT fahrenheit
END`,
  },
  {
    title: "Fahrenheit to Celsius",
    description: "Read a temperature in Fahrenheit and convert it to Celsius.",
    pseudocode: `START
INPUT fahrenheit
celsius = (fahrenheit - 32) * 5 / 9
OUTPUT celsius
END`,
  },
  {
    title: "Kilometers to Miles",
    description: "Read a distance in kilometers and convert it to miles.",
    pseudocode: `START
INPUT km
miles = km * 0.621371
OUTPUT miles
END`,
  },
  {
    title: "Kilograms to Pounds",
    description: "Read a weight in kilograms and convert it to pounds.",
    pseudocode: `START
INPUT kg
pounds = kg * 2.20462
OUTPUT pounds
END`,
  },
  {
    title: "Minutes to Hours and Minutes",
    description: "Read a duration in total minutes and display it as whole hours and remaining minutes.",
    pseudocode: `START
INPUT totalMinutes
hours = totalMinutes / 60 (integer division)
minutes = totalMinutes MOD 60
OUTPUT hours, minutes
END`,
  },
  {
    title: "Seconds to H:M:S",
    description: "Read a duration in total seconds and display it as hours, minutes, and seconds.",
    pseudocode: `START
INPUT totalSeconds
hours = totalSeconds / 3600 (integer division)
remaining = totalSeconds MOD 3600
minutes = remaining / 60 (integer division)
seconds = remaining MOD 60
OUTPUT hours, minutes, seconds
END`,
  },
  {
    title: "Perimeter of a Rectangle",
    description: "Read the width and height of a rectangle and calculate its perimeter.",
    pseudocode: `START
INPUT width, height
perimeter = 2 * (width + height)
OUTPUT perimeter
END`,
  },
  {
    title: "Area of a Rectangle",
    description: "Read the width and height of a rectangle and calculate its area.",
    pseudocode: `START
INPUT width, height
area = width * height
OUTPUT area
END`,
  },
  {
    title: "Area of a Triangle",
    description: "Read the base and height of a triangle and calculate its area.",
    pseudocode: `START
INPUT base, height
area = (base * height) / 2
OUTPUT area
END`,
  },
  {
    title: "Area of a Circle",
    description: "Read the radius of a circle and calculate its area.",
    pseudocode: `START
INPUT radius
area = 3.14159 * radius * radius
OUTPUT area
END`,
  },
  {
    title: "Circumference of a Circle",
    description: "Read the radius of a circle and calculate its circumference.",
    pseudocode: `START
INPUT radius
circumference = 2 * 3.14159 * radius
OUTPUT circumference
END`,
  },
  {
    title: "Volume of a Cube",
    description: "Read the side length of a cube and calculate its volume.",
    pseudocode: `START
INPUT side
volume = side * side * side
OUTPUT volume
END`,
  },
  {
    title: "Volume of a Cylinder",
    description: "Read the radius and height of a cylinder and calculate its volume.",
    pseudocode: `START
INPUT radius, height
volume = 3.14159 * radius * radius * height
OUTPUT volume
END`,
  },
  {
    title: "Simple Interest",
    description: "Read a principal amount, interest rate, and time (years), then calculate simple interest.",
    pseudocode: `START
INPUT principal, rate, time
interest = (principal * rate * time) / 100
OUTPUT interest
END`,
  },
  {
    title: "Total Price With Sales Tax",
    description: "Read a price and a tax rate (%), then calculate the total price including tax.",
    pseudocode: `START
INPUT price, taxRate
taxAmount = price * (taxRate / 100)
total = price + taxAmount
OUTPUT total
END`,
  },
  {
    title: "Restaurant Bill With Tip",
    description: "Read a bill amount and a tip percentage, then calculate the total amount to pay.",
    pseudocode: `START
INPUT billAmount, tipPercent
tipAmount = billAmount * (tipPercent / 100)
total = billAmount + tipAmount
OUTPUT total
END`,
  },
  {
    title: "Age in Days",
    description: "Read a person's age in years and estimate their age in days (using 365.25 days per year).",
    pseudocode: `START
INPUT ageInYears
ageInDays = ageInYears * 365.25
OUTPUT ageInDays
END`,
  },
  {
    title: "Distance Between Two Points on a Line",
    description: "Read two positions on a number line and calculate the distance between them.",
    pseudocode: `START
INPUT x1, x2
distance = ABS(x2 - x1)
OUTPUT distance
END`,
  },
  {
    title: "Distance Between Two Points (2D)",
    description: "Read the coordinates of two points and calculate the straight-line distance between them.",
    pseudocode: `START
INPUT x1, y1, x2, y2
dx = x2 - x1
dy = y2 - y1
distance = SQRT(dx * dx + dy * dy)
OUTPUT distance
END`,
  },
  {
    title: "Slope Between Two Points",
    description: "Read the coordinates of two points and calculate the slope of the line through them.",
    pseudocode: `START
INPUT x1, y1, x2, y2
slope = (y2 - y1) / (x2 - x1)
OUTPUT slope
END`,
  },
  {
    title: "Final Velocity",
    description: "Read an initial velocity, acceleration, and time, then calculate the final velocity using v = u + at.",
    pseudocode: `START
INPUT initialVelocity, acceleration, time
finalVelocity = initialVelocity + (acceleration * time)
OUTPUT finalVelocity
END`,
  },
  {
    title: "Body Mass Index",
    description: "Read a person's weight (kg) and height (m), then calculate their BMI.",
    pseudocode: `START
INPUT weightKg, heightM
bmi = weightKg / (heightM * heightM)
OUTPUT bmi
END`,
  },
  {
    title: "Tiles Needed for a Floor",
    description: "Read the floor area and the area of a single tile, then calculate how many tiles are needed.",
    pseudocode: `START
INPUT floorArea, tileArea
tilesNeeded = CEILING(floorArea / tileArea)
OUTPUT tilesNeeded
END`,
  },
  {
    title: "Dual Temperature Conversion",
    description: "Read a Celsius temperature and display it converted to both Fahrenheit and Kelvin.",
    pseudocode: `START
INPUT celsius
fahrenheit = (celsius * 9 / 5) + 32
kelvin = celsius + 273.15
OUTPUT fahrenheit, kelvin
END`,
  },
  {
    title: "Net Salary After Deduction",
    description: "Read a gross salary and a fixed deduction amount, then calculate the net salary.",
    pseudocode: `START
INPUT grossSalary, deduction
netSalary = grossSalary - deduction
OUTPUT netSalary
END`,
  },
  {
    title: "Compound Interest (One Period)",
    description: "Read a principal amount, interest rate, and number of compounding periods, then calculate the final amount.",
    pseudocode: `START
INPUT principal, rate, periods
amount = principal * (1 + rate / 100) ^ periods
OUTPUT amount
END`,
  },
  {
    title: "Total Cost of N Items",
    description: "Read the price of a single item and the quantity purchased, then calculate the total cost.",
    pseudocode: `START
INPUT unitPrice, quantity
totalCost = unitPrice * quantity
OUTPUT totalCost
END`,
  },
];

// ---------------------------------------------------------------------------
// CONDITION - branching logic with IF / ELSE (33 problems)
// ---------------------------------------------------------------------------
export const conditionProblems: SeedProblem[] = [
  {
    title: "Positive, Negative, or Zero",
    description: "Read a number and determine whether it is positive, negative, or zero.",
    pseudocode: `START
INPUT number
IF number > 0 THEN
    OUTPUT "Positive"
ELSE IF number < 0 THEN
    OUTPUT "Negative"
ELSE
    OUTPUT "Zero"
END IF
END`,
  },
  {
    title: "Even or Odd",
    description: "Read a number and determine whether it is even or odd.",
    pseudocode: `START
INPUT number
IF number MOD 2 = 0 THEN
    OUTPUT "Even"
ELSE
    OUTPUT "Odd"
END IF
END`,
  },
  {
    title: "Larger of Two Numbers",
    description: "Read two numbers and determine which one is larger.",
    pseudocode: `START
INPUT a, b
IF a > b THEN
    OUTPUT a, "is larger"
ELSE IF b > a THEN
    OUTPUT b, "is larger"
ELSE
    OUTPUT "Both are equal"
END IF
END`,
  },
  {
    title: "Largest of Three Numbers",
    description: "Read three numbers and determine which one is the largest.",
    pseudocode: `START
INPUT a, b, c
IF a >= b AND a >= c THEN
    OUTPUT a, "is the largest"
ELSE IF b >= a AND b >= c THEN
    OUTPUT b, "is the largest"
ELSE
    OUTPUT c, "is the largest"
END IF
END`,
  },
  {
    title: "Leap Year Check",
    description: "Read a year and determine whether it is a leap year.",
    pseudocode: `START
INPUT year
IF (year MOD 4 = 0 AND year MOD 100 != 0) OR (year MOD 400 = 0) THEN
    OUTPUT "Leap year"
ELSE
    OUTPUT "Not a leap year"
END IF
END`,
  },
  {
    title: "Exam Score to Letter Grade",
    description: "Read a numeric exam score (0-100) and convert it to a letter grade (A, B, C, D, or F).",
    pseudocode: `START
INPUT score
IF score >= 90 THEN
    grade = "A"
ELSE IF score >= 80 THEN
    grade = "B"
ELSE IF score >= 70 THEN
    grade = "C"
ELSE IF score >= 60 THEN
    grade = "D"
ELSE
    grade = "F"
END IF
OUTPUT grade
END`,
  },
  {
    title: "Voting Eligibility",
    description: "Read a person's age and determine if they are eligible to vote (18 or older).",
    pseudocode: `START
INPUT age
IF age >= 18 THEN
    OUTPUT "Eligible to vote"
ELSE
    OUTPUT "Not eligible to vote"
END IF
END`,
  },
  {
    title: "Movie Ticket Price by Age",
    description: "Read a customer's age and determine the ticket price: child (under 12), adult (12-64), or senior (65+).",
    pseudocode: `START
INPUT age
IF age < 12 THEN
    price = 5
ELSE IF age <= 64 THEN
    price = 12
ELSE
    price = 8
END IF
OUTPUT price
END`,
  },
  {
    title: "Valid Triangle Check",
    description: "Read three side lengths and determine whether they can form a valid triangle.",
    pseudocode: `START
INPUT sideA, sideB, sideC
IF (sideA + sideB > sideC) AND (sideA + sideC > sideB) AND (sideB + sideC > sideA) THEN
    OUTPUT "Valid triangle"
ELSE
    OUTPUT "Not a valid triangle"
END IF
END`,
  },
  {
    title: "BMI Category",
    description: "Read a calculated BMI value and classify it as underweight, normal, overweight, or obese.",
    pseudocode: `START
INPUT bmi
IF bmi < 18.5 THEN
    OUTPUT "Underweight"
ELSE IF bmi < 25 THEN
    OUTPUT "Normal"
ELSE IF bmi < 30 THEN
    OUTPUT "Overweight"
ELSE
    OUTPUT "Obese"
END IF
END`,
  },
  {
    title: "Divisible by 3 and 5",
    description: "Read a number and determine whether it is divisible by both 3 and 5.",
    pseudocode: `START
INPUT number
IF number MOD 3 = 0 AND number MOD 5 = 0 THEN
    OUTPUT "Divisible by both 3 and 5"
ELSE
    OUTPUT "Not divisible by both"
END IF
END`,
  },
  {
    title: "Shipping Cost by Weight",
    description: "Read a package weight (kg) and determine the shipping cost: light (<=1kg), medium (<=5kg), or heavy (>5kg).",
    pseudocode: `START
INPUT weight
IF weight <= 1 THEN
    cost = 3
ELSE IF weight <= 5 THEN
    cost = 7
ELSE
    cost = 15
END IF
OUTPUT cost
END`,
  },
  {
    title: "Discount by Purchase Amount",
    description: "Read a total purchase amount and determine the discount percentage: 0% under $50, 10% under $200, else 20%.",
    pseudocode: `START
INPUT totalAmount
IF totalAmount < 50 THEN
    discount = 0
ELSE IF totalAmount < 200 THEN
    discount = 10
ELSE
    discount = 20
END IF
OUTPUT discount
END`,
  },
  {
    title: "Vowel or Consonant",
    description: "Read a single letter and determine whether it is a vowel or a consonant.",
    pseudocode: `START
INPUT letter
IF letter = "A" OR letter = "E" OR letter = "I" OR letter = "O" OR letter = "U" THEN
    OUTPUT "Vowel"
ELSE
    OUTPUT "Consonant"
END IF
END`,
  },
  {
    title: "Century Common Year Check",
    description: "Read a year that is a multiple of 100, and determine if it is a leap year under the Gregorian rule.",
    pseudocode: `START
INPUT year
IF year MOD 400 = 0 THEN
    OUTPUT "Leap year"
ELSE
    OUTPUT "Common year"
END IF
END`,
  },
  {
    title: "Weekday or Weekend",
    description: "Read a day number (1 = Monday ... 7 = Sunday) and determine if it is a weekday or weekend.",
    pseudocode: `START
INPUT dayNumber
IF dayNumber = 6 OR dayNumber = 7 THEN
    OUTPUT "Weekend"
ELSE
    OUTPUT "Weekday"
END IF
END`,
  },
  {
    title: "Password Length Check",
    description: "Read a password's length and determine whether it meets the minimum requirement of 8 characters.",
    pseudocode: `START
INPUT passwordLength
IF passwordLength >= 8 THEN
    OUTPUT "Password length OK"
ELSE
    OUTPUT "Password too short"
END IF
END`,
  },
  {
    title: "Quadrant of a Point",
    description: "Read the x and y coordinates of a point and determine which quadrant it lies in.",
    pseudocode: `START
INPUT x, y
IF x > 0 AND y > 0 THEN
    OUTPUT "Quadrant I"
ELSE IF x < 0 AND y > 0 THEN
    OUTPUT "Quadrant II"
ELSE IF x < 0 AND y < 0 THEN
    OUTPUT "Quadrant III"
ELSE IF x > 0 AND y < 0 THEN
    OUTPUT "Quadrant IV"
ELSE
    OUTPUT "On an axis"
END IF
END`,
  },
  {
    title: "Multiple Check",
    description: "Read two numbers and determine whether the first is a multiple of the second.",
    pseudocode: `START
INPUT number, divisor
IF number MOD divisor = 0 THEN
    OUTPUT "Multiple"
ELSE
    OUTPUT "Not a multiple"
END IF
END`,
  },
  {
    title: "Pass or Fail",
    description: "Read a score and determine pass or fail, where 50 or higher is a pass.",
    pseudocode: `START
INPUT score
IF score >= 50 THEN
    OUTPUT "Pass"
ELSE
    OUTPUT "Fail"
END IF
END`,
  },
  {
    title: "Income Tax Bracket",
    description: "Read an annual income and determine the tax bracket: 0% under 10000, 10% under 40000, else 20%.",
    pseudocode: `START
INPUT income
IF income < 10000 THEN
    bracket = "0%"
ELSE IF income < 40000 THEN
    bracket = "10%"
ELSE
    bracket = "20%"
END IF
OUTPUT bracket
END`,
  },
  {
    title: "Right Triangle Check",
    description: "Read three side lengths and determine whether they form a right triangle (Pythagorean theorem).",
    pseudocode: `START
INPUT a, b, c
longest = MAX(a, b, c)
IF longest * longest = (a*a + b*b + c*c - longest*longest) THEN
    OUTPUT "Right triangle"
ELSE
    OUTPUT "Not a right triangle"
END IF
END`,
  },
  {
    title: "Winner Between Two Scores",
    description: "Read two players' scores and determine the winner, or report a tie.",
    pseudocode: `START
INPUT scoreA, scoreB
IF scoreA > scoreB THEN
    OUTPUT "Player A wins"
ELSE IF scoreB > scoreA THEN
    OUTPUT "Player B wins"
ELSE
    OUTPUT "It's a tie"
END IF
END`,
  },
  {
    title: "Number Within Range",
    description: "Read a number and a lower and upper bound, then determine whether the number falls within the range.",
    pseudocode: `START
INPUT number, lowerBound, upperBound
IF number >= lowerBound AND number <= upperBound THEN
    OUTPUT "Within range"
ELSE
    OUTPUT "Out of range"
END IF
END`,
  },
  {
    title: "PIN Login Check",
    description: "Read an entered PIN and the correct PIN, then determine whether access is granted.",
    pseudocode: `START
INPUT enteredPin, correctPin
IF enteredPin = correctPin THEN
    OUTPUT "Access granted"
ELSE
    OUTPUT "Access denied"
END IF
END`,
  },
  {
    title: "Shipping Priority Surcharge",
    description: "Read a shipping priority level (1 = standard, 2 = express, 3 = overnight) and determine the surcharge.",
    pseudocode: `START
INPUT priorityLevel
IF priorityLevel = 1 THEN
    surcharge = 0
ELSE IF priorityLevel = 2 THEN
    surcharge = 10
ELSE
    surcharge = 25
END IF
OUTPUT surcharge
END`,
  },
  {
    title: "Season From Month Number",
    description: "Read a month number (1-12) and determine the season (Winter, Spring, Summer, Fall).",
    pseudocode: `START
INPUT month
IF month = 12 OR month = 1 OR month = 2 THEN
    OUTPUT "Winter"
ELSE IF month >= 3 AND month <= 5 THEN
    OUTPUT "Spring"
ELSE IF month >= 6 AND month <= 8 THEN
    OUTPUT "Summer"
ELSE
    OUTPUT "Fall"
END IF
END`,
  },
  {
    title: "Loan Eligibility",
    description: "Read an applicant's age and income, then determine loan eligibility (must be 21+ and earn at least 20000).",
    pseudocode: `START
INPUT age, income
IF age >= 21 AND income >= 20000 THEN
    OUTPUT "Eligible for loan"
ELSE
    OUTPUT "Not eligible for loan"
END IF
END`,
  },
  {
    title: "Sign of a Product",
    description: "Read two numbers and determine the sign of their product (positive, negative, or zero) without multiplying them.",
    pseudocode: `START
INPUT a, b
IF a = 0 OR b = 0 THEN
    OUTPUT "Zero"
ELSE IF (a > 0 AND b > 0) OR (a < 0 AND b < 0) THEN
    OUTPUT "Positive"
ELSE
    OUTPUT "Negative"
END IF
END`,
  },
  {
    title: "Body Temperature Status",
    description: "Read a body temperature in Celsius and classify it as hypothermia, normal, or fever.",
    pseudocode: `START
INPUT temperature
IF temperature < 35 THEN
    OUTPUT "Hypothermia"
ELSE IF temperature <= 37.5 THEN
    OUTPUT "Normal"
ELSE
    OUTPUT "Fever"
END IF
END`,
  },
  {
    title: "Maximum of Two With Category",
    description: "Read two numbers, determine the maximum, and label it as small (<10), medium (<100), or large.",
    pseudocode: `START
INPUT a, b
IF a > b THEN
    maximum = a
ELSE
    maximum = b
END IF
IF maximum < 10 THEN
    OUTPUT maximum, "Small"
ELSE IF maximum < 100 THEN
    OUTPUT maximum, "Medium"
ELSE
    OUTPUT maximum, "Large"
END IF
END`,
  },
  {
    title: "Taxi Fare by Distance",
    description: "Read a trip distance in km and calculate the base fare: 3.5 flat under 2km, plus 1.2/km beyond that.",
    pseudocode: `START
INPUT distance
IF distance <= 2 THEN
    fare = 3.5
ELSE
    fare = 3.5 + (distance - 2) * 1.2
END IF
OUTPUT fare
END`,
  },
  {
    title: "Honor Roll Status",
    description: "Read a student's GPA and attendance percentage, then determine honor roll status (GPA >= 3.5 and attendance >= 90%).",
    pseudocode: `START
INPUT gpa, attendance
IF gpa >= 3.5 AND attendance >= 90 THEN
    OUTPUT "Honor roll"
ELSE
    OUTPUT "Not honor roll"
END IF
END`,
  },
];

// ---------------------------------------------------------------------------
// LOOP - repetition with WHILE / FOR (33 problems)
// ---------------------------------------------------------------------------
export const loopProblems: SeedProblem[] = [
  {
    title: "Sum From 1 to N",
    description: "Read a number N and calculate the sum of all whole numbers from 1 to N.",
    pseudocode: `START
INPUT n
sum = 0
FOR i = 1 TO n
    sum = sum + i
END FOR
OUTPUT sum
END`,
  },
  {
    title: "Factorial of N",
    description: "Read a number N and calculate its factorial (N!).",
    pseudocode: `START
INPUT n
factorial = 1
FOR i = 1 TO n
    factorial = factorial * i
END FOR
OUTPUT factorial
END`,
  },
  {
    title: "Multiplication Table",
    description: "Read a number and print its multiplication table from 1 to 10.",
    pseudocode: `START
INPUT number
FOR i = 1 TO 10
    result = number * i
    OUTPUT number, "x", i, "=", result
END FOR
END`,
  },
  {
    title: "Count Digits of a Number",
    description: "Read a number and count how many digits it has.",
    pseudocode: `START
INPUT number
count = 0
WHILE number > 0
    number = number / 10 (integer division)
    count = count + 1
END WHILE
OUTPUT count
END`,
  },
  {
    title: "Reverse a Number",
    description: "Read a number and display it with its digits reversed.",
    pseudocode: `START
INPUT number
reversed = 0
WHILE number > 0
    digit = number MOD 10
    reversed = (reversed * 10) + digit
    number = number / 10 (integer division)
END WHILE
OUTPUT reversed
END`,
  },
  {
    title: "Sum of Digits",
    description: "Read a number and calculate the sum of its digits.",
    pseudocode: `START
INPUT number
sum = 0
WHILE number > 0
    digit = number MOD 10
    sum = sum + digit
    number = number / 10 (integer division)
END WHILE
OUTPUT sum
END`,
  },
  {
    title: "Prime Number Check",
    description: "Read a number and determine whether it is prime using a loop that tests possible divisors.",
    pseudocode: `START
INPUT number
isPrime = TRUE
IF number < 2 THEN
    isPrime = FALSE
END IF
FOR i = 2 TO number - 1
    IF number MOD i = 0 THEN
        isPrime = FALSE
    END IF
END FOR
IF isPrime = TRUE THEN
    OUTPUT "Prime"
ELSE
    OUTPUT "Not prime"
END IF
END`,
  },
  {
    title: "First N Fibonacci Numbers",
    description: "Read a number N and print the first N terms of the Fibonacci sequence.",
    pseudocode: `START
INPUT n
first = 0
second = 1
FOR i = 1 TO n
    OUTPUT first
    next = first + second
    first = second
    second = next
END FOR
END`,
  },
  {
    title: "Sum of Even Numbers to N",
    description: "Read a number N and calculate the sum of all even numbers from 1 to N.",
    pseudocode: `START
INPUT n
sum = 0
FOR i = 1 TO n
    IF i MOD 2 = 0 THEN
        sum = sum + i
    END IF
END FOR
OUTPUT sum
END`,
  },
  {
    title: "Sum of Odd Numbers to N",
    description: "Read a number N and calculate the sum of all odd numbers from 1 to N.",
    pseudocode: `START
INPUT n
sum = 0
FOR i = 1 TO n
    IF i MOD 2 != 0 THEN
        sum = sum + i
    END IF
END FOR
OUTPUT sum
END`,
  },
  {
    title: "Count Multiples of 3",
    description: "Read a number N and count how many numbers between 1 and N are divisible by 3.",
    pseudocode: `START
INPUT n
count = 0
FOR i = 1 TO n
    IF i MOD 3 = 0 THEN
        count = count + 1
    END IF
END FOR
OUTPUT count
END`,
  },
  {
    title: "Largest of N Numbers",
    description: "Read how many numbers will be entered, then read that many numbers and find the largest.",
    pseudocode: `START
INPUT count
largest = -INFINITY
FOR i = 1 TO count
    INPUT number
    IF number > largest THEN
        largest = number
    END IF
END FOR
OUTPUT largest
END`,
  },
  {
    title: "Smallest of N Numbers",
    description: "Read how many numbers will be entered, then read that many numbers and find the smallest.",
    pseudocode: `START
INPUT count
smallest = +INFINITY
FOR i = 1 TO count
    INPUT number
    IF number < smallest THEN
        smallest = number
    END IF
END FOR
OUTPUT smallest
END`,
  },
  {
    title: "Average of N Numbers",
    description: "Read how many numbers will be entered, then read that many numbers and calculate their average.",
    pseudocode: `START
INPUT count
sum = 0
FOR i = 1 TO count
    INPUT number
    sum = sum + number
END FOR
average = sum / count
OUTPUT average
END`,
  },
  {
    title: "Countdown From N",
    description: "Read a number N and print a countdown from N down to 1.",
    pseudocode: `START
INPUT n
WHILE n >= 1
    OUTPUT n
    n = n - 1
END WHILE
END`,
  },
  {
    title: "Power Using Repeated Multiplication",
    description: "Read a base and an exponent, then calculate the result using repeated multiplication (no power operator).",
    pseudocode: `START
INPUT base, exponent
result = 1
FOR i = 1 TO exponent
    result = result * base
END FOR
OUTPUT result
END`,
  },
  {
    title: "GCD by Repeated Subtraction",
    description: "Read two numbers and calculate their greatest common divisor using repeated subtraction.",
    pseudocode: `START
INPUT a, b
WHILE a != b
    IF a > b THEN
        a = a - b
    ELSE
        b = b - a
    END IF
END WHILE
OUTPUT a
END`,
  },
  {
    title: "Palindrome Word Check",
    description: "Read a word and determine whether it reads the same forwards and backwards by comparing characters from both ends.",
    pseudocode: `START
INPUT word
left = 0
right = LENGTH(word) - 1
isPalindrome = TRUE
WHILE left < right
    IF word[left] != word[right] THEN
        isPalindrome = FALSE
    END IF
    left = left + 1
    right = right - 1
END WHILE
OUTPUT isPalindrome
END`,
  },
  {
    title: "Count Vowels in a Word",
    description: "Read a word and count how many vowels it contains.",
    pseudocode: `START
INPUT word
count = 0
FOR i = 0 TO LENGTH(word) - 1
    letter = word[i]
    IF letter = "A" OR letter = "E" OR letter = "I" OR letter = "O" OR letter = "U" THEN
        count = count + 1
    END IF
END FOR
OUTPUT count
END`,
  },
  {
    title: "Sum of a Harmonic Series",
    description: "Read a number N and calculate the sum of the series 1 + 1/2 + 1/3 + ... + 1/N.",
    pseudocode: `START
INPUT n
sum = 0
FOR i = 1 TO n
    sum = sum + (1 / i)
END FOR
OUTPUT sum
END`,
  },
  {
    title: "Print All Divisors",
    description: "Read a number and print every positive divisor of it.",
    pseudocode: `START
INPUT number
FOR i = 1 TO number
    IF number MOD i = 0 THEN
        OUTPUT i
    END IF
END FOR
END`,
  },
  {
    title: "Total Sales From N Entries",
    description: "Read how many days of sales data will be entered, then read each day's sales and calculate the total.",
    pseudocode: `START
INPUT dayCount
total = 0
FOR i = 1 TO dayCount
    INPUT dailySales
    total = total + dailySales
END FOR
OUTPUT total
END`,
  },
  {
    title: "ATM PIN Retry Loop",
    description: "Simulate an ATM that allows up to 3 attempts to enter the correct PIN before locking the account.",
    pseudocode: `START
INPUT correctPin
attempts = 0
success = FALSE
WHILE attempts < 3 AND success = FALSE
    INPUT enteredPin
    attempts = attempts + 1
    IF enteredPin = correctPin THEN
        success = TRUE
    END IF
END WHILE
IF success = TRUE THEN
    OUTPUT "Access granted"
ELSE
    OUTPUT "Account locked"
END IF
END`,
  },
  {
    title: "Right Triangle Star Pattern",
    description: "Read a number of rows N and print a right triangle pattern of stars, with row i containing i stars.",
    pseudocode: `START
INPUT n
FOR i = 1 TO n
    line = ""
    FOR j = 1 TO i
        line = line + "*"
    END FOR
    OUTPUT line
END FOR
END`,
  },
  {
    title: "Compound Interest Over N Years",
    description: "Read a principal, an annual interest rate, and a number of years, then calculate the final amount year by year using a loop.",
    pseudocode: `START
INPUT principal, rate, years
amount = principal
FOR i = 1 TO years
    amount = amount + (amount * rate / 100)
END FOR
OUTPUT amount
END`,
  },
  {
    title: "Count Occurrences in a List",
    description: "Read how many numbers will be entered and a target value, then count how many times the target appears.",
    pseudocode: `START
INPUT count, target
matches = 0
FOR i = 1 TO count
    INPUT number
    IF number = target THEN
        matches = matches + 1
    END IF
END FOR
OUTPUT matches
END`,
  },
  {
    title: "Shopping Cart Running Total",
    description: "Repeatedly read item prices and add them to a running total, stopping when the user enters 0.",
    pseudocode: `START
total = 0
INPUT price
WHILE price != 0
    total = total + price
    INPUT price
END WHILE
OUTPUT total
END`,
  },
  {
    title: "Collatz Sequence Steps",
    description: "Read a number N and count how many steps it takes to reduce it to 1 using the Collatz rule (halve if even, triple plus one if odd).",
    pseudocode: `START
INPUT n
steps = 0
WHILE n != 1
    IF n MOD 2 = 0 THEN
        n = n / 2
    ELSE
        n = (n * 3) + 1
    END IF
    steps = steps + 1
END WHILE
OUTPUT steps
END`,
  },
  {
    title: "Perfect Number Check",
    description: "Read a number and determine whether it is a perfect number (equal to the sum of its proper divisors).",
    pseudocode: `START
INPUT number
sumOfDivisors = 0
FOR i = 1 TO number - 1
    IF number MOD i = 0 THEN
        sumOfDivisors = sumOfDivisors + i
    END IF
END FOR
IF sumOfDivisors = number THEN
    OUTPUT "Perfect number"
ELSE
    OUTPUT "Not a perfect number"
END IF
END`,
  },
  {
    title: "LCM Using a Loop",
    description: "Read two numbers and calculate their least common multiple by checking multiples of the larger number.",
    pseudocode: `START
INPUT a, b
larger = MAX(a, b)
multiple = larger
FOUND = FALSE
WHILE FOUND = FALSE
    IF multiple MOD a = 0 AND multiple MOD b = 0 THEN
        FOUND = TRUE
    ELSE
        multiple = multiple + larger
    END IF
END WHILE
OUTPUT multiple
END`,
  },
  {
    title: "Number Guessing Game",
    description: "Repeatedly read a guess and compare it to a secret number, giving higher/lower hints until the guess is correct.",
    pseudocode: `START
INPUT secretNumber
INPUT guess
WHILE guess != secretNumber
    IF guess < secretNumber THEN
        OUTPUT "Too low"
    ELSE
        OUTPUT "Too high"
    END IF
    INPUT guess
END WHILE
OUTPUT "Correct!"
END`,
  },
  {
    title: "Total Distance From N Segments",
    description: "Read how many trip segments will be entered, then read each segment's distance and calculate the total distance traveled.",
    pseudocode: `START
INPUT segmentCount
totalDistance = 0
FOR i = 1 TO segmentCount
    INPUT segmentDistance
    totalDistance = totalDistance + segmentDistance
END FOR
OUTPUT totalDistance
END`,
  },
  {
    title: "Fibonacci Values Below N",
    description: "Read a limit N and print every Fibonacci number that is less than N.",
    pseudocode: `START
INPUT n
first = 0
second = 1
WHILE first < n
    OUTPUT first
    next = first + second
    first = second
    second = next
END WHILE
END`,
  },
];
