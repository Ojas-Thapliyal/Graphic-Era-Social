import { useState, useEffect, useMemo, useRef } from "react";
import { fetchNotes, uploadNote, uploadPdfAnonymous, API_BASE_URL } from "../services/api";

const DEFAULT_NOTES = [
  // --- 1st Semester Notes (Standard Semester) ---
  {
    id: 1,
    title: "C Programming: Array Fundamentals & Operations Complete Notes",
    subject: "Programming for Problem Solving (TCS 101 / C Programming)",
    semester: "1st Semester",
    branch: "B.Tech CSE / IT / All Branches",
    university: "Graphic Era Deemed & Hill University",
    uploader: "Aarav Sharma",
    uploader_avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80",
    file_size: "4.76 MB",
    file_type: "PDF Document",
    file_url: "/uploads/notes/Array.pdf",
    downloads: 532,
    rating: 5.0,
    pages: 45,
    tags: ["#1stSem", "#CProgramming", "#Arrays", "#TCS101", "#Notes"],
    summary: "Master 1D and 2D arrays, contiguous memory allocation, array traversal, insertion, deletion, matrix math operations, and array-of-string manipulations in C.",
    units: [
      {
        unit_number: 1,
        title: "Array Fundamentals & Memory Allocation",
        description: "Arrays are homogeneous collections of elements stored in contiguous memory locations. Indexing starts from 0 to N-1.",
        key_topics: [
          "Declaration syntax `int arr[10];`",
          "Base address and element addressing `Addr(A[i]) = Base + i * sizeof(type)`",
          "Static vs Dynamic initialization"
        ],
        code_sample: `// Array declaration and traversal
#include <stdio.h>
int main() {
    int arr[5] = {10, 20, 30, 40, 50};
    for(int i = 0; i < 5; i++) {
        printf("Element at index %d = %d\\n", i, arr[i]);
    }
    return 0;
}`,
        exam_tips: "Always check array bounds to prevent segmentation faults and buffer overflow."
      },
      {
        unit_number: 2,
        title: "2D Arrays & Matrix Operations",
        description: "2D arrays represent tables with rows and columns. Stored in Row-Major order in C by default.",
        key_topics: [
          "Row-Major vs Column-Major ordering",
          "Matrix Multiplication algorithm with O(N^3) time",
          "Sparse Matrix representation"
        ],
        code_sample: `// Matrix Addition in C
for(int i = 0; i < r; i++) {
    for(int j = 0; j < c; j++) {
        C[i][j] = A[i][j] + B[i][j];
    }
}`,
        exam_tips: "In end-terms, 10-mark questions frequently ask for Matrix Multiplication logic with boundary condition checks."
      }
    ],
    key_formulas: [
      "1D Array Address: Loc(A[i]) = Base(A) + w * (i - Lower_Bound)",
      "2D Row Major: Loc(A[i][j]) = Base(A) + w * [(i - LB1) * N + (j - LB2)]",
      "Matrix Multiplication condition: Columns of Matrix A must equal Rows of Matrix B"
    ],
    exam_questions: [
      "Write an algorithm and C program to perform binary search on a sorted 1D array. State its best and worst case time complexity.",
      "Explain how 2D arrays are stored in memory using Row-Major order with numerical calculation example.",
      "Write a modular C function to find the transpose of an N x N square matrix without using auxiliary memory."
    ]
  },
  {
    id: 2,
    title: "Functions, Recursion & Modular Programming in C",
    subject: "Programming for Problem Solving (TCS 101 / C Programming)",
    semester: "1st Semester",
    branch: "B.Tech (All Branches / 1st Year)",
    university: "Graphic Era Deemed & Hill University",
    uploader: "Priya Verma",
    uploader_avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
    file_size: "3.30 MB",
    file_type: "PDF Document",
    file_url: "/uploads/notes/Functions.pdf",
    downloads: 489,
    rating: 4.9,
    pages: 36,
    tags: ["#1stSem", "#Functions", "#Recursion", "#TCS101", "#Notes"],
    summary: "Comprehensive guide on user-defined functions, call by value vs call by reference, recursion mechanics, stack frames, and storage classes.",
    units: [
      {
        unit_number: 1,
        title: "Modular Programming & Function Prototypes",
        description: "Functions divide large codebases into modular, testable, and reusable blocks.",
        key_topics: [
          "Function prototype, definition, and invocation",
          "Formal vs Actual arguments",
          "Return statement rules"
        ],
        code_sample: `int gcd(int a, int b) {
    if (b == 0) return a;
    return gcd(b, a % b);
}`,
        exam_tips: "Explain the difference between Call by Value and Call by Reference using pointer addresses in diagrammatic form."
      },
      {
        unit_number: 2,
        title: "Recursion & Call Stack Management",
        description: "Recursion solves complex problems by solving smaller instances of the same problem. Base condition prevents stack overflow.",
        key_topics: [
          "Base Case vs Recursive Case",
          "Tower of Hanoi problem with O(2^n) complexity",
          "Direct vs Indirect recursion"
        ],
        code_sample: `void towerOfHanoi(int n, char from, char to, char aux) {
    if (n == 1) {
        printf("Move disk 1 from %c to %c\\n", from, to);
        return;
    }
    towerOfHanoi(n-1, from, aux, to);
    printf("Move disk %d from %c to %c\\n", n, from, to);
    towerOfHanoi(n-1, aux, to, from);
}`,
        exam_tips: "Trace the recursive call stack for Tower of Hanoi for N=3 disks."
      }
    ],
    key_formulas: [
      "Tower of Hanoi Minimum Moves: 2^n - 1",
      "Storage classes in C: auto, register, static, extern",
      "Scope vs Lifetime of static local variables"
    ],
    exam_questions: [
      "Differentiate between Call by Value and Call by Reference with suitable code examples.",
      "Write a recursive C program for Fibonacci series and discuss its time and space complexity."
    ]
  },
  {
    id: 3,
    title: "Pointers & Dynamic Memory Allocation in C",
    subject: "Programming for Problem Solving (TCS 101 / C Programming)",
    semester: "1st Semester",
    branch: "B.Tech CSE / IT / ECE",
    university: "Graphic Era Deemed & Hill University",
    uploader: "Devansh Rawat",
    uploader_avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80",
    file_size: "0.71 MB",
    file_type: "PDF Document",
    file_url: "/uploads/notes/Pointers.pdf",
    downloads: 612,
    rating: 5.0,
    pages: 24,
    tags: ["#1stSem", "#Pointers", "#DMA", "#Malloc", "#Notes"],
    summary: "Deep dive into pointer arithmetic, double pointers, dynamic memory allocation with malloc, calloc, realloc, free, and dangling pointer resolution.",
    units: [
      {
        unit_number: 1,
        title: "Pointers and Memory Addresses",
        description: "Pointers hold memory addresses of other variables. Essential for low-level memory manipulation.",
        key_topics: [
          "Dereference operator * and address operator &",
          "Pointer arithmetic (+, -, ++, --)",
          "Pointer to Pointer (Double Pointer)"
        ],
        code_sample: `int x = 100;
int *ptr = &x;
int **dptr = &ptr;
printf("Value: %d, Address: %p\\n", **dptr, (void*)ptr);`,
        exam_tips: "Pointer arithmetic increments by sizeof(data_type) bytes, not just 1 byte."
      },
      {
        unit_number: 2,
        title: "Dynamic Memory Allocation (Heap Management)",
        description: "Allocating memory at runtime using heap memory via standard library functions.",
        key_topics: [
          "malloc() allocates uninitialized bytes",
          "calloc() allocates and zero-initializes memory",
          "realloc() and free() to prevent memory leaks"
        ],
        code_sample: `int *arr = (int*)malloc(n * sizeof(int));
if(arr == NULL) {
    printf("Memory allocation failed!\\n");
    return 1;
}
// Use memory...
free(arr);
arr = NULL; // Prevent dangling pointer`,
        exam_tips: "Always check for NULL after malloc/calloc and set pointer to NULL after free()."
      }
    ],
    key_formulas: [
      "Pointer Arithmetic: ptr + k = Current_Address + k * sizeof(*ptr)",
      "Memory functions: malloc(size), calloc(num, size), realloc(ptr, new_size), free(ptr)"
    ],
    exam_questions: [
      "What is a dangling pointer and how can it lead to segmentation faults? How do you prevent it?",
      "Explain the difference between malloc() and calloc() with appropriate syntax and memory diagrams."
    ]
  },
  {
    id: 4,
    title: "Computer Engineering Fundamentals & Hardware Components Handbook",
    subject: "Basic Electrical & Electronics / Fundamentals (TEC 101)",
    semester: "1st Semester",
    branch: "B.Tech (All Branches / 1st Year)",
    university: "Graphic Era Deemed & Hill University",
    uploader: "Ananya Joshi",
    uploader_avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80",
    file_size: "8.05 MB",
    file_type: "PDF Document",
    file_url: "/uploads/notes/All_in_one_components.pdf",
    downloads: 745,
    rating: 4.9,
    pages: 68,
    tags: ["#1stSem", "#Hardware", "#DigitalLogic", "#TEC101", "#Notes"],
    summary: "Detailed handbook on logic gates, Karnaugh Maps, Flip-Flops, Combinational & Sequential circuits, diodes, rectifiers, and transistor biasing.",
    units: [
      {
        unit_number: 1,
        title: "Digital Logic & Boolean Algebra",
        description: "Fundamentals of binary logic gates (AND, OR, NOT, NAND, NOR, XOR, XNOR) and algebraic simplification.",
        key_topics: [
          "Universal Gates (NAND, NOR)",
          "De Morgan's Laws",
          "K-Map 2, 3, and 4 variable minimization"
        ],
        code_sample: `// De Morgan's Law verification:
// (A + B)' = A' . B'
// (A . B)' = A' + B'`,
        exam_tips: "Master SOP (Sum of Products) and POS (Product of Sums) K-Map grouping rules."
      }
    ],
    key_formulas: [
      "De Morgan 1: ~(A + B) = ~A . ~B",
      "De Morgan 2: ~(A . B) = ~A + ~B",
      "Full Adder: Sum = A ^ B ^ Cin, Cout = (A.B) + (Cin.(A ^ B))"
    ],
    exam_questions: [
      "Implement full adder circuit using only universal NAND gates.",
      "Minimize the 4-variable Boolean function using Karnaugh Map: F(A,B,C,D) = Σm(0,2,5,7,8,10,13,15)."
    ]
  },
  {
    id: 5,
    title: "Engineering Mathematics I: Matrices & Calculus Complete Guide",
    subject: "Engineering Mathematics I (TMA 101)",
    semester: "1st Semester",
    branch: "B.Tech (All Branches / 1st Year)",
    university: "Graphic Era Deemed & Hill University",
    uploader: "Rohan Gupta",
    uploader_avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    file_size: "5.20 MB",
    file_type: "PDF Document",
    file_url: "/uploads/notes/Math1_Calculus.pdf",
    downloads: 680,
    rating: 4.9,
    pages: 52,
    tags: ["#1stSem", "#EngineeringMath", "#Matrices", "#Calculus", "#TMA101"],
    summary: "Eigenvalues & Eigenvectors, Cayley-Hamilton theorem, Leibnitz theorem for successive differentiation, Jacobians, and multiple integrals.",
    units: [
      {
        unit_number: 1,
        title: "Matrices & Linear Systems",
        description: "Rank of matrices, Echelon form, Normal form, Consistency of linear equations, Cayley-Hamilton Theorem.",
        key_topics: [
          "Rank of matrix via Echelon form",
          "Cayley-Hamilton Theorem: A matrix satisfies its characteristic equation",
          "Diagonalization of symmetric matrices"
        ],
        code_sample: `Characteristic equation: |A - λI| = 0
Cayley-Hamilton: Replace λ with Matrix A to find A^(-1) and higher powers.`,
        exam_tips: "Cayley-Hamilton verification is a guaranteed 10-mark end-term question."
      }
    ],
    key_formulas: [
      "Characteristic Equation: det(A - λI) = 0",
      "Trace of Matrix = Sum of Eigenvalues",
      "Determinant of Matrix = Product of Eigenvalues"
    ],
    exam_questions: [
      "State and prove Cayley-Hamilton theorem. Use it to find A^-1 for a given 3x3 matrix.",
      "Evaluate double integral over specified region by changing order of integration."
    ]
  },

  // --- 2nd Semester Notes ---
  {
    id: 6,
    title: "Object-Oriented Programming with C++ & Design Patterns",
    subject: "Object Oriented Programming (TCS 201)",
    semester: "2nd Semester",
    branch: "B.Tech CSE / IT / ECE",
    university: "Graphic Era Deemed University",
    uploader: "Harshit Pant",
    uploader_avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
    file_size: "4.1 MB",
    file_type: "PDF Document",
    file_url: "/uploads/notes/OOP_CPP_Notes.pdf",
    downloads: 410,
    rating: 4.9,
    pages: 48,
    tags: ["#Sem2", "#CPP", "#OOP", "#Inheritance", "#Polymorphism"],
    summary: "Core object-oriented concepts in C++: Classes, Objects, Constructors, Operator Overloading, Virtual Functions, Abstract Classes, and STL.",
    units: [
      {
        unit_number: 1,
        title: "Encapsulation, Inheritance & Polymorphism",
        description: "Core pillars of Object-Oriented paradigm. Virtual functions enable runtime dynamic polymorphism via vtables.",
        key_topics: [
          "Constructor & Destructor lifecycle",
          "Multiple & Virtual inheritance to solve diamond problem",
          "Virtual destructors in base classes"
        ],
        code_sample: `#include <iostream>
using namespace std;
class Base {
public:
    virtual void show() { cout << "Base Show" << endl; }
    virtual ~Base() {}
};
class Derived : public Base {
public:
    void show() override { cout << "Derived Show" << endl; }
};`,
        exam_tips: "Explain the vptr and vtable mechanism used by C++ compilers for dynamic binding."
      }
    ],
    key_formulas: [
      "Four Pillars: Encapsulation, Abstraction, Inheritance, Polymorphism",
      "Pure Virtual Function: virtual void func() = 0;"
    ],
    exam_questions: [
      "What is the diamond problem in C++ and how does virtual base class resolve it?",
      "Write a C++ program demonstrating operator overloading for adding two Complex numbers."
    ]
  },
  {
    id: 7,
    title: "Engineering Mathematics II: Differential Equations & Transforms",
    subject: "Engineering Mathematics II (TMA 201)",
    semester: "2nd Semester",
    branch: "B.Tech (All Branches / 1st Year)",
    university: "Graphic Era Deemed & Hill University",
    uploader: "Neha Bisht",
    uploader_avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
    file_size: "4.8 MB",
    file_type: "PDF Document",
    file_url: "/uploads/notes/Math2_Differential.pdf",
    downloads: 395,
    rating: 4.8,
    pages: 50,
    tags: ["#Sem2", "#Math2", "#DifferentialEquations", "#Laplace", "#Fourier"],
    summary: "First & higher order differential equations, Laplace transforms, Inverse Laplace, Convolution theorem, and Fourier series.",
    units: [
      {
        unit_number: 1,
        title: "Laplace Transforms & Applications",
        description: "Integral transform converting differential equations in time domain into algebraic equations in frequency s-domain.",
        key_topics: [
          "Laplace of standard functions e^(at), sin(at), cos(at), t^n",
          "First & Second Shifting Theorems",
          "Convolution Theorem"
        ],
        code_sample: "L{f(t)} = integral from 0 to inf of e^(-st) * f(t) dt",
        exam_tips: "Convolution theorem is heavily tested for solving inverse Laplace integrals."
      }
    ],
    key_formulas: [
      "L{t^n} = n! / s^(n+1)",
      "L{e^(at)} = 1 / (s - a)",
      "L{sin(at)} = a / (s^2 + a^2)"
    ],
    exam_questions: [
      "Solve the initial value differential equation using Laplace transform: y'' + 4y = sin(2t), y(0)=0, y'(0)=0.",
      "State Convolution Theorem and use it to find the Inverse Laplace Transform of 1 / [s(s^2 + 1)]."
    ]
  },

  // --- 3rd Semester Notes ---
  {
    id: 8,
    title: "Data Structures with C: Stacks, Queues, Trees & Graphs",
    subject: "Data Structures (TCS 301)",
    semester: "3rd Semester",
    branch: "B.Tech CSE / IT",
    university: "Graphic Era Deemed University",
    uploader: "Devansh Rawat",
    uploader_avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80",
    file_size: "5.6 MB",
    file_type: "PDF Document",
    file_url: "/uploads/notes/DS_Notes.pdf",
    downloads: 820,
    rating: 5.0,
    pages: 64,
    tags: ["#Sem3", "#DataStructures", "#BST", "#Graphs", "#Stacks", "#TCS301"],
    summary: "Handwritten and typed notes on linear and non-linear data structures: Linked Lists, Infix-to-Postfix conversion, BST, AVL Trees, BFS, DFS, and Hashing.",
    units: [
      {
        unit_number: 1,
        title: "Trees & Binary Search Trees (BST)",
        description: "Hierarchical data structure. BST satisfies property: Left subtree < Root < Right subtree.",
        key_topics: [
          "Tree traversals: Inorder (gives sorted sequence in BST), Preorder, Postorder",
          "AVL Tree rotations (LL, RR, LR, RL)",
          "Height & Balance factor calculation"
        ],
        code_sample: `struct Node* insert(struct Node* node, int key) {
    if (node == NULL) return newNode(key);
    if (key < node->key) node->left = insert(node->left, key);
    else if (key > node->key) node->right = insert(node->right, key);
    return node;
}`,
        exam_tips: "Practice AVL rotations with step-by-step tree drawings."
      }
    ],
    key_formulas: [
      "Maximum nodes at level i of binary tree: 2^i",
      "Maximum nodes in binary tree of height h: 2^(h+1) - 1",
      "Balance Factor of Node: Height(Left Subtree) - Height(Right Subtree)"
    ],
    exam_questions: [
      "Construct an AVL tree by inserting the following elements one by one: 40, 20, 10, 25, 30, 22, 50.",
      "Write an algorithm to convert an infix expression to postfix using a stack with trace table."
    ]
  },
  {
    id: 9,
    title: "Discrete Mathematical Structures & Combinatorics",
    subject: "Discrete Structures (TCS 302)",
    semester: "3rd Semester",
    branch: "B.Tech CSE / IT / AI-DS",
    university: "Graphic Era Deemed & Hill University",
    uploader: "Kavya Pandey",
    uploader_avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80",
    file_size: "4.5 MB",
    file_type: "PDF Document",
    file_url: "/uploads/notes/Discrete_Math.pdf",
    downloads: 560,
    rating: 4.8,
    pages: 44,
    tags: ["#Sem3", "#DiscreteMath", "#GraphTheory", "#SetTheory", "#TCS302"],
    summary: "Propositional logic, Sets, Relations, Posets, Hasse diagrams, Lattices, Algebraic structures, Groups, and Graph theory.",
    units: [
      {
        unit_number: 1,
        title: "Graph Theory & Planarity",
        description: "Euler formula for planar graphs, Chromatic numbers, Hamiltonian paths, and Trees.",
        key_topics: [
          "Euler's Formula: V - E + R = 2",
          "Kuratowski's Theorem on non-planar graphs K5 and K3,3",
          "Handshaking Lemma"
        ],
        code_sample: "Sum of degrees of all vertices = 2 * (Number of edges)",
        exam_tips: "Handshaking lemma is used to prove regular graph vertex-edge properties."
      }
    ],
    key_formulas: [
      "Euler's Formula for Planar Graphs: V - E + F = 2",
      "Handshaking Theorem: Σ deg(v) = 2 * |E|"
    ],
    exam_questions: [
      "Show that in any graph, the number of vertices with odd degree is always even.",
      "Draw the Hasse diagram for the poset (D36, |) where D36 is the set of all divisors of 36."
    ]
  },

  // --- 4th Semester Notes ---
  {
    id: 10,
    title: "Operating Systems: Process Synchronization & Memory Management",
    subject: "Operating Systems (TCS 404)",
    semester: "4th Semester",
    branch: "B.Tech CSE / IT",
    university: "Graphic Era Deemed University",
    uploader: "Devansh Rawat",
    uploader_avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80",
    file_size: "4.2 MB",
    file_type: "PDF Document",
    file_url: "/uploads/notes/OS_Notes.pdf",
    downloads: 648,
    rating: 4.9,
    pages: 42,
    tags: ["#OS", "#Sem4", "#SemExam", "#Deadlocks", "#Paging"],
    summary: "Complete notes covering CPU scheduling algorithms, Semaphores, Classical synchronization problems (Dining Philosophers, Producer-Consumer), Banker's algorithm, and Virtual Memory paging.",
    units: [
      {
        unit_number: 1,
        title: "Process Synchronization & Semaphores",
        description: "Resolving Critical Section Problem using hardware instructions (TestAndSet) and counting/binary semaphores.",
        key_topics: [
          "Mutual Exclusion, Progress, Bounded Waiting",
          "Peterson's Solution for 2 processes",
          "Producer-Consumer bounded buffer problem"
        ],
        code_sample: `wait(semaphore S) {
    while (S <= 0);
    S--;
}
signal(semaphore S) {
    S++;
}`,
        exam_tips: "Always mention the 3 requirements for critical section solution in long-answer questions."
      },
      {
        unit_number: 2,
        title: "Deadlock Characterization & Avoidance",
        description: "Deadlock occurs when processes are permanently blocked waiting for resources.",
        key_topics: [
          "4 Coffman Conditions: Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait",
          "Resource Allocation Graph (RAG)",
          "Banker's Algorithm for Safe State checking"
        ],
        code_sample: `Need[i][j] = Max[i][j] - Allocation[i][j]
If Need[i] <= Available, allocate and return resources.`,
        exam_tips: "Practice Banker's Algorithm numerical calculations with 5 processes and 3 resource types."
      }
    ],
    key_formulas: [
      "Banker's Need Matrix: Need[i][j] = Max[i][j] - Allocation[i][j]",
      "Effective Memory Access Time (EMAT): EMAT = h * (m + c) + (1 - h) * (2m + c)",
      "Safe State: If there exists a safe sequence <P1, P2, ... Pn> of process completion"
    ],
    exam_questions: [
      "Consider 5 processes P0-P4 and 3 resource types A(10), B(5), C(7). Apply Banker's Algorithm to find if system is in safe state.",
      "Explain Paging mechanism with hardware translation diagram and calculate Effective Access Time with TLB hit ratio 90%."
    ]
  },
  {
    id: 11,
    title: "Database Management Systems: SQL Queries, Normalization & ACID Complete Guide",
    subject: "Database Management Systems (TCS 403)",
    semester: "4th Semester",
    branch: "B.Tech CSE / AI & DS",
    university: "Graphic Era Hill University",
    uploader: "Priya Verma",
    uploader_avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
    file_size: "3.5 MB",
    file_type: "PDF Document",
    file_url: "/uploads/notes/DBMS_Notes.pdf",
    downloads: 520,
    rating: 4.9,
    pages: 35,
    tags: ["#DBMS", "#SQL", "#GEHU", "#Normalization", "#ACID"],
    summary: "ER diagrams, Relational Algebra, Complex SQL queries, Functional Dependencies, 1NF, 2NF, 3NF, BCNF, ACID transactions, and Concurrency Control (2PL).",
    units: [
      {
        unit_number: 1,
        title: "Functional Dependencies & Normal Forms",
        description: "Eliminating insertion, deletion, and update anomalies through systematic schema decomposition.",
        key_topics: [
          "1NF (Atomic attributes)",
          "2NF (No partial dependency on candidate keys)",
          "3NF (No transitive dependency) and BCNF (LHS must be super key)"
        ],
        code_sample: `-- SQL Query to find second highest salary
SELECT MAX(salary) 
FROM employees 
WHERE salary < (SELECT MAX(salary) FROM employees);`,
        exam_tips: "Remember: Every relation in BCNF is in 3NF, but the reverse is not always true."
      }
    ],
    key_formulas: [
      "BCNF Rule: In every non-trivial FD X -> Y, X must be a Super Key",
      "3NF Rule: In X -> Y, either X is Super Key or Y is Prime Attribute",
      "ACID Properties: Atomicity, Consistency, Isolation, Durability"
    ],
    exam_questions: [
      "Given relation R(A,B,C,D,E) with FDs {A->BC, CD->E, B->D, E->A}. Find Candidate Keys and highest normal form.",
      "Explain Strict Two-Phase Locking (Strict 2PL) protocol and prove why it avoids cascading rollbacks."
    ]
  },

  // --- 5th Semester Notes ---
  {
    id: 12,
    title: "Design & Analysis of Algorithms: Dynamic Programming & Greedy Handwritten Notes",
    subject: "Design & Analysis of Algorithms (TCS 502)",
    semester: "5th Semester",
    branch: "B.Tech CSE",
    university: "Graphic Era Deemed University",
    uploader: "Aarav Sharma",
    uploader_avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80",
    file_size: "7.8 MB",
    file_type: "PDF Document",
    file_url: "/uploads/notes/DAA_Notes.pdf",
    downloads: 715,
    rating: 4.8,
    pages: 68,
    tags: ["#DAA", "#Algorithms", "#DynamicProgramming", "#Greedy", "#TCS502"],
    summary: "Asymptotic notations, Master theorem, Divide & Conquer (Strassen's), Greedy (Huffman, MST), DP (0/1 Knapsack, LCS, Floyd-Warshall), Backtracking (N-Queens) and NP-Completeness.",
    units: [
      {
        unit_number: 1,
        title: "Dynamic Programming Paradigms",
        description: "Solving optimization problems with overlapping subproblems and optimal substructure.",
        key_topics: [
          "0/1 Knapsack problem with DP matrix",
          "Longest Common Subsequence (LCS)",
          "Matrix Chain Multiplication (MCM)"
        ],
        code_sample: `// LCS DP Table
int dp[m+1][n+1];
for(int i=0; i<=m; i++) {
    for(int j=0; j<=n; j++) {
        if(i==0 || j==0) dp[i][j] = 0;
        else if(X[i-1] == Y[j-1]) dp[i][j] = 1 + dp[i-1][j-1];
        else dp[i][j] = max(dp[i-1][j], dp[i][j-1]);
    }
}`,
        exam_tips: "Always write the recurrence relation first before constructing the DP tabulation table."
      }
    ],
    key_formulas: [
      "Master Theorem: T(n) = aT(n/b) + f(n) -> Compare n^(log_b(a)) with f(n)",
      "0/1 Knapsack: V[i, w] = max(V[i-1, w], val[i] + V[i-1, w - wt[i]])",
      "MCM: m[i, j] = min_{i<=k<j} (m[i,k] + m[k+1,j] + p_{i-1} * p_k * p_j)"
    ],
    exam_questions: [
      "Solve the 0/1 Knapsack problem for capacity W=8 with given weights [2,3,4,5] and values [1,2,5,6] using DP table.",
      "Find the Optimal Parenthesization for Matrix Chain Multiplication for matrices with dimensions: <10, 20, 30, 40, 30>."
    ]
  },

  // --- 6th Semester Notes ---
  {
    id: 13,
    title: "Computer Networks: OSI Model, TCP/IP, Routing Algorithms & Subnetting",
    subject: "Computer Networks (TCS 601)",
    semester: "6th Semester",
    branch: "B.Tech CSE",
    university: "Graphic Era Deemed University",
    uploader: "Rohan Gupta",
    uploader_avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    file_size: "5.1 MB",
    file_type: "PDF Document",
    file_url: "/uploads/notes/CN_Notes.pdf",
    downloads: 489,
    rating: 4.7,
    pages: 50,
    tags: ["#Networks", "#CN", "#Sem6", "#TCP", "#Subnetting"],
    summary: "OSI 7 Layers vs TCP/IP stack, Sliding Window protocols (Go-Back-N, Selective Repeat), IPv4/IPv6 subnetting, CIDR, Dijkstra SPF, Distance Vector Routing, and TCP 3-way handshake.",
    units: [
      {
        unit_number: 1,
        title: "Network Layer: Subnetting & Routing",
        description: "IP addressing, Classful vs CIDR subnetting, Dijkstra shortest path routing and Bellman-Ford Distance Vector routing.",
        key_topics: [
          "FLSM vs VLSM Subnet calculations",
          "Count-to-Infinity problem in Distance Vector Routing",
          "Link State Routing Protocol (OSPF)"
        ],
        code_sample: `// Subnet Mask Calculation for /26:
// 255.255.255.192
// Block size = 256 - 192 = 64
// Usable hosts per subnet = 64 - 2 = 62 hosts`,
        exam_tips: "Practice calculating Network ID, Broadcast ID, and First/Last Usable IP for given CIDR prefixes."
      }
    ],
    key_formulas: [
      "Usable Hosts in Subnet: 2^(32 - prefix_length) - 2",
      "Go-Back-N Efficiency: N / (1 + 2a), where a = Propagation_Time / Transmission_Time",
      "Selective Repeat Efficiency: N / (1 + 2a), Sender Window = Receiver Window = 2^(k-1)"
    ],
    exam_questions: [
      "An organization is granted block 192.168.10.0/24. Subnet it into 4 equal subnets. State subnet mask, range and broadcast address of each.",
      "Differentiate between Go-Back-N and Selective Repeat ARQ protocols with sender and receiver window size mechanics."
    ]
  },

  // --- 7th Semester Notes ---
  {
    id: 14,
    title: "Cloud Computing Architecture & Big Data Analytics",
    subject: "Cloud Computing (TCS 701)",
    semester: "7th Semester",
    branch: "B.Tech CSE / Cloud / IT",
    university: "Graphic Era Deemed & Hill University",
    uploader: "Devansh Rawat",
    uploader_avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80",
    file_size: "4.6 MB",
    file_type: "PDF Document",
    file_url: "/uploads/notes/Cloud_BigData.pdf",
    downloads: 380,
    rating: 4.9,
    pages: 46,
    tags: ["#Sem7", "#CloudComputing", "#AWS", "#HDFS", "#BigData"],
    summary: "Cloud deployment and service models (IaaS, PaaS, SaaS), Type 1 & 2 Hypervisors, Docker containerization, Hadoop HDFS architecture, MapReduce paradigms, and SLA management.",
    units: [
      {
        unit_number: 1,
        title: "Cloud Architecture & Virtualization",
        description: "Enabling elasticity and multi-tenancy through bare-metal and hosted hypervisors, container engines, and distributed clusters.",
        key_topics: [
          "IaaS, PaaS, SaaS comparative architecture",
          "Full vs Para-virtualization",
          "Hadoop NameNode and DataNode architecture"
        ],
        code_sample: `// Hadoop MapReduce Flow:
// Input -> Splitting -> Mapping -> Shuffling/Sorting -> Reducing -> Final Output`,
        exam_tips: "Explain the single point of failure in Hadoop 1.x NameNode vs High Availability in Hadoop 2.x/3.x."
      }
    ],
    key_formulas: [
      "Availability SLA: A = MTBF / (MTBF + MTTR) * 100%",
      "Hadoop Default Replication Factor: 3 (1 local node, 1 same rack, 1 remote rack)"
    ],
    exam_questions: [
      "Explain Hadoop HDFS architecture with block replication strategy and rack awareness.",
      "Differentiate between Virtual Machines and Docker Containers in terms of startup latency, resource overhead, and isolation."
    ]
  },

  // --- 8th Semester Notes ---
  {
    id: 15,
    title: "Information Security, Cryptography & Cyber Defense Handbook",
    subject: "Cyber Security (TCS 801)",
    semester: "8th Semester",
    branch: "B.Tech CSE / IT / Cyber Security",
    university: "Graphic Era Deemed University",
    uploader: "Aarav Sharma",
    uploader_avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80",
    file_size: "5.4 MB",
    file_type: "PDF Document",
    file_url: "/uploads/notes/Cyber_Security.pdf",
    downloads: 420,
    rating: 5.0,
    pages: 54,
    tags: ["#Sem8", "#CyberSecurity", "#Cryptography", "#RSA", "#Security"],
    summary: "CIA Triad, Symmetric (DES, AES) and Asymmetric ciphers (RSA, Diffie-Hellman), SHA-256 hash algorithms, digital signatures, SSL/TLS handshake, and firewalls.",
    units: [
      {
        unit_number: 1,
        title: "Public Key Cryptography & Key Exchange",
        description: "Asymmetric encryption using prime factorization and discrete logarithm hardness assumptions.",
        key_topics: [
          "RSA algorithm mathematical proof",
          "Diffie-Hellman key exchange and Man-in-the-Middle attack",
          "Digital Signatures for non-repudiation"
        ],
        code_sample: `// RSA Key Generation:
// 1. Choose primes p, q -> n = p * q, phi(n) = (p-1)*(q-1)
// 2. Select e such that gcd(e, phi(n)) = 1
// 3. Compute d = e^(-1) mod phi(n)
// Public Key: (e, n), Private Key: (d, n)
// Ciphertext C = M^e mod n, Plaintext M = C^d mod n`,
        exam_tips: "Practice calculating RSA key pairs and encrypting small integer values by hand."
      }
    ],
    key_formulas: [
      "Euler Totient: phi(n) = (p - 1) * (q - 1)",
      "RSA Encryption: C = M^e mod n, Decryption: M = C^d mod n",
      "Diffie-Hellman Shared Secret: K = (Y_B)^X_A mod q = (Y_A)^X_B mod q"
    ],
    exam_questions: [
      "Perform RSA key generation given p=7, q=11, and e=13. Encrypt message M=9 and verify decryption.",
      "Explain the steps involved in SSL/TLS handshake for secure HTTPS communication."
    ]
  }
];

// Helper to resolve PDF URL for embedding & downloading
function resolvePdfUrl(fileUrl) {
  if (!fileUrl) return "/uploads/notes/Array.pdf";
  if (fileUrl.startsWith("http://") || fileUrl.startsWith("https://")) {
    return fileUrl;
  }
  const cleanPath = fileUrl.startsWith("/") ? fileUrl : `/${fileUrl}`;
  // If API_BASE_URL is available use it, otherwise use relative path
  return `${API_BASE_URL}${cleanPath}`;
}

function Notes() {
  const [notes, setNotes] = useState(DEFAULT_NOTES);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedSem, setSelectedSem] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showUpload, setShowUpload] = useState(false);

  // Online Viewer Modal States
  const [activeViewerNote, setActiveViewerNote] = useState(null);
  const [viewerMode, setViewerMode] = useState("reader"); // "reader" | "pdf" | "formulas"
  const [readerFontSize, setReaderFontSize] = useState("text-sm");
  const [noteSearchTerm, setNoteSearchTerm] = useState("");
  const [copiedToast, setCopiedToast] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const modalContainerRef = useRef(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    semester: "1st Semester",
    branch: "B.Tech CSE",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadingPdf, setUploadingPdf] = useState(false);

  const loadNotes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchNotes(selectedSem);
      if (data && data.notes && data.notes.length > 0) {
        setNotes(data.notes);
      } else {
        const filtered = selectedSem
          ? DEFAULT_NOTES.filter((n) => {
              const sem = n.semester.toLowerCase();
              const q = selectedSem.toLowerCase();
              return sem.includes(q) || (q === "1st" && sem.includes("1st"));
            })
          : DEFAULT_NOTES;
        setNotes(filtered);
      }
    } catch (err) {
      console.warn("Using fallback study notes dataset:", err);
      const filtered = selectedSem
        ? DEFAULT_NOTES.filter((n) => {
            const sem = n.semester.toLowerCase();
            const q = selectedSem.toLowerCase();
            return sem.includes(q) || (q === "1st" && sem.includes("1st"));
          })
        : DEFAULT_NOTES;
      setNotes(filtered);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotes();
  }, [selectedSem]);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && activeViewerNote) {
        setActiveViewerNote(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeViewerNote]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.subject.trim()) return;

    try {
      setUploadingPdf(true);
      let fileUrl = null;
      let calculatedSize = "3.5 MB";

      if (selectedFile) {
        try {
          const uploadRes = await uploadPdfAnonymous(selectedFile);
          if (uploadRes && uploadRes.public_url) {
            fileUrl = uploadRes.public_url;
            calculatedSize = `${uploadRes.size_mb} MB`;
          }
        } catch (uploadErr) {
          console.warn("Anonymous upload error, using local fallback path:", uploadErr);
          fileUrl = `/uploads/notes/${selectedFile.name.replace(/\s+/g, "_")}`;
          calculatedSize = `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB`;
        }
      }

      const res = await uploadNote({
        ...formData,
        file_url: fileUrl,
        file_size: calculatedSize,
      });

      if (res && res.note) {
        setNotes((prev) => [res.note, ...prev]);
        setFormData({
          title: "",
          subject: "",
          semester: "1st Semester",
          branch: "B.Tech CSE",
        });
        setSelectedFile(null);
        setShowUpload(false);
        alert("🎉 Note shared successfully with campus peers!");
      }
    } catch (err) {
      alert("Failed to upload note: " + err.message);
    } finally {
      setUploadingPdf(false);
    }
  };

  // Safe & Reliable PDF Downloader
  const handleDownloadNote = (note) => {
    const targetUrl = resolvePdfUrl(note.file_url);
    const filename = `${note.title.replace(/[^a-zA-Z0-9_-]/g, "_")}.pdf`;

    try {
      const link = document.createElement("a");
      link.href = targetUrl;
      link.download = filename;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      // Fallback: Generate Client-side Text/Markdown Study File
      const content = `GRAPHIC ERA DEEMED & HILL UNIVERSITY - ACADEMIC STUDY NOTES
========================================================================
Title: ${note.title}
Subject: ${note.subject}
Semester: ${note.semester}
Branch: ${note.branch}
Author: ${note.uploader}
Rating: ${note.rating} / 5.0 (${note.downloads || 400}+ downloads)
========================================================================

SUMMARY:
${note.summary || "Complete handwritten and lecture notes for examination preparation."}

${(note.units || [])
  .map(
    (u) => `
UNIT ${u.unit_number}: ${u.title.toUpperCase()}
------------------------------------------------------------------------
${u.description}

Key Topics:
${(u.key_topics || []).map((t) => `  * ${t}`).join("\n")}

${u.code_sample ? `Code Example:\n${u.code_sample}\n` : ""}
Exam Tip: ${u.exam_tips}
`
  )
  .join("\n")}

KEY FORMULAS & DEFINITIONS:
${(note.key_formulas || []).map((f, i) => `${i + 1}. ${f}`).join("\n")}

IMPORTANT EXAM QUESTIONS:
${(note.exam_questions || []).map((q, i) => `Q${i + 1}: ${q}`).join("\n")}
========================================================================
Generated by Graphic Era Social Platform Notes Viewer.`;

      const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${note.title.replace(/[^a-zA-Z0-9_-]/g, "_")}_Notes.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    }
  };

  // Copy full note text to clipboard
  const handleCopyNotes = (note) => {
    const text = `📚 ${note.title}
Subject: ${note.subject} (${note.semester} - ${note.branch})
Shared by: ${note.uploader}

Summary: ${note.summary || ""}

Units & Chapters:
${(note.units || [])
  .map(
    (u) => `• Unit ${u.unit_number}: ${u.title}
  ${u.description}
  Key Topics: ${u.key_topics?.join(", ")}
  Exam Tip: ${u.exam_tips}`
  )
  .join("\n\n")}

Key Formulas:
${(note.key_formulas || []).map((f) => `- ${f}`).join("\n")}

Exam Questions:
${(note.exam_questions || []).map((q) => `? ${q}`).join("\n")}`;

    navigator.clipboard.writeText(text).then(() => {
      setCopiedToast("Notes copied to clipboard! 📋");
      setTimeout(() => setCopiedToast(""), 3000);
    });
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (modalContainerRef.current?.requestFullscreen) {
        modalContainerRef.current.requestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  // Filtered Notes List
  const filteredNotes = useMemo(() => {
    return notes.filter((n) => {
      const semMatch =
        !selectedSem ||
        n.semester.toLowerCase().includes(selectedSem.toLowerCase()) ||
        (selectedSem === "1st" && n.semester.toLowerCase().includes("1st"));

      const branchMatch =
        !selectedBranch ||
        n.branch.toLowerCase().includes(selectedBranch.toLowerCase());

      const s = searchQuery.toLowerCase().trim();
      const searchMatch =
        !s ||
        n.title.toLowerCase().includes(s) ||
        n.subject.toLowerCase().includes(s) ||
        (n.summary && n.summary.toLowerCase().includes(s)) ||
        (n.tags && n.tags.some((t) => t.toLowerCase().includes(s))) ||
        n.uploader.toLowerCase().includes(s);

      return semMatch && branchMatch && searchMatch;
    });
  }, [notes, selectedSem, selectedBranch, searchQuery]);

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      {/* Toast Notification */}
      {copiedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-amber-600 text-white px-5 py-3 rounded-2xl shadow-xl font-bold text-xs flex items-center gap-2 animate-bounce">
          <span>✓</span>
          <span>{copiedToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800/60">
              📚 Academic Study Hub
            </span>
            <span className="text-xs text-slate-500 font-medium">All 1st to 8th Semesters Supported</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-amber-400 dark:via-orange-300 dark:to-rose-400">
            Study Notes & Resources
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
            Read online or download peer-verified handwritten lecture notes, formula sheets, and chapter summaries.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowUpload(!showUpload)}
            className="px-4 py-2.5 text-xs font-bold rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white transition shadow-md shadow-amber-600/20 flex items-center gap-1.5"
          >
            <span>{showUpload ? "✕ Close Form" : "📤 Share Notes"}</span>
          </button>
          <button
            onClick={loadNotes}
            className="px-4 py-2.5 text-xs font-semibold rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-sm dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 dark:border-slate-700 transition flex items-center gap-1"
          >
            <span>🔄</span>
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Upload Box */}
      {showUpload && (
        <form
          onSubmit={handleUpload}
          className="bg-white dark:bg-slate-800/90 border border-amber-300 dark:border-amber-500/40 rounded-3xl p-6 sm:p-8 mb-8 shadow-xl space-y-4 transition-all duration-300"
        >
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
            <div>
              <h3 className="text-base font-bold text-amber-700 dark:text-amber-300">
                Share Academic Study Notes
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Upload your handwritten or typed lecture notes to help Graphic Era campus peers.
              </p>
            </div>
            <span className="text-xs px-3 py-1 bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 rounded-full font-semibold border border-amber-200 dark:border-amber-800">
              ⚡ Instant Peer Sharing
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Note Title *
              </label>
              <input
                type="text"
                placeholder="e.g. C Programming Arrays & Pointers Complete Notes"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-200 placeholder-slate-400 text-xs rounded-xl p-3 border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Subject Name & Code *
              </label>
              <input
                type="text"
                placeholder="e.g. Programming for Problem Solving (TCS 101)"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-200 placeholder-slate-400 text-xs rounded-xl p-3 border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Select Semester (1st to 8th) *
              </label>
              <select
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-200 text-xs rounded-xl p-3 border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-amber-500"
              >
                <option value="1st Semester">1st Semester (1st Year)</option>
                <option value="2nd Semester">2nd Semester (1st Year)</option>
                <option value="3rd Semester">3rd Semester (2nd Year)</option>
                <option value="4th Semester">4th Semester (2nd Year)</option>
                <option value="5th Semester">5th Semester (3rd Year)</option>
                <option value="6th Semester">6th Semester (3rd Year)</option>
                <option value="7th Semester">7th Semester (4th Year)</option>
                <option value="8th Semester">8th Semester (4th Year)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Branch / Discipline
              </label>
              <input
                type="text"
                placeholder="e.g. B.Tech CSE / IT / All Branches"
                value={formData.branch}
                onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-200 placeholder-slate-400 text-xs rounded-xl p-3 border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Attach Note PDF File (Optional - Supports Storage Upload & Online Reader)
              </label>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)}
                className="w-full bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-200 text-xs rounded-xl p-2.5 border border-slate-300 dark:border-slate-700 focus:outline-none file:mr-3 file:py-1.5 file:px-3.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-amber-600 file:text-white hover:file:bg-amber-500 cursor-pointer"
              />
              {selectedFile && (
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-semibold">
                  ✓ Selected File: {selectedFile.name} ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowUpload(false)}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploadingPdf}
              className="px-6 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition shadow-md shadow-amber-600/20 flex items-center gap-2"
            >
              {uploadingPdf ? "Uploading Note..." : "Publish & Share Notes"}
            </button>
          </div>
        </form>
      )}

      {/* SEARCH & FILTERS BAR */}
      <div className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-3xl p-5 mb-8 shadow-sm space-y-4">
        {/* Search Input */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
            🔍
          </span>
          <input
            type="text"
            placeholder="Search by topic (e.g. Arrays, Recursion, Pointers, Operating Systems, TCS 101, SQL)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 text-xs sm:text-sm rounded-2xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-amber-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-xs text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          )}
        </div>

        {/* Semester Filter Tabs (All semesters 1 to 8 treated equally) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
              Filter by Semester:
            </span>
            <span className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
              Showing {filteredNotes.length} notes
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { id: "", label: "All Semesters" },
              { id: "1st", label: "Sem 1" },
              { id: "2nd", label: "Sem 2" },
              { id: "3rd", label: "Sem 3" },
              { id: "4th", label: "Sem 4" },
              { id: "5th", label: "Sem 5" },
              { id: "6th", label: "Sem 6" },
              { id: "7th", label: "Sem 7" },
              { id: "8th", label: "Sem 8" },
            ].map((f) => {
              const isActive = selectedSem === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setSelectedSem(f.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    isActive
                      ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md shadow-amber-600/20"
                      : "bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  <span>{f.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="text-center py-16">
          <div className="inline-block w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-3 font-medium">
            Loading verified study notes from repository...
          </p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-2xl p-4 mb-6 text-amber-800 dark:text-amber-200 text-sm">
          {error}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredNotes.length === 0 && (
        <div className="text-center py-16 bg-white dark:bg-slate-800/50 rounded-3xl border border-slate-200 dark:border-slate-700">
          <p className="text-3xl mb-2">📑</p>
          <p className="text-slate-800 dark:text-slate-200 font-bold text-base">
            No notes found matching your criteria
          </p>
          <p className="text-slate-500 text-xs mt-1">
            Try choosing 'All Semesters' or adjusting your search query.
          </p>
          <button
            onClick={() => {
              setSelectedSem("");
              setSearchQuery("");
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-bold hover:bg-amber-500 transition"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* NOTES CARDS GRID */}
      {!loading && filteredNotes.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-amber-500/50 dark:hover:border-amber-400/50 rounded-3xl p-5 shadow-sm hover:shadow-xl transition duration-200 flex flex-col justify-between group"
            >
              <div>
                {/* Header Tag Bar */}
                <div className="flex items-start justify-between gap-2 mb-2.5">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800/60">
                    📄 {note.semester}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-lg border border-amber-200 dark:border-amber-800/40">
                    <span>★</span>
                    <span>{note.rating || "5.0"}</span>
                  </div>
                </div>

                {/* Subject & Branch line */}
                <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1 line-clamp-1">
                  {note.subject}
                </p>

                {/* Title */}
                <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition mb-2 leading-snug line-clamp-2">
                  {note.title}
                </h3>

                {/* Summary snippet */}
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3 line-clamp-2">
                  {note.summary || "Complete handwritten lecture notes, formulas, and diagrams for university exams."}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {(note.tags || []).slice(0, 4).map((tag, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSearchQuery(tag.replace("#", ""))}
                      className="text-[10px] font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-900/80 hover:bg-amber-100 dark:hover:bg-amber-950 hover:text-amber-700 dark:hover:text-amber-300 px-2 py-0.5 rounded-md transition"
                    >
                      {tag}
                    </button>
                  ))}
                </div>

                {/* Contributor / Uploader */}
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-slate-700/60">
                  <img
                    src={
                      note.uploader_avatar ||
                      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"
                    }
                    alt={note.uploader}
                    className="w-7 h-7 rounded-full object-cover border border-amber-300/40"
                  />
                  <div className="truncate">
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {note.uploader}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                      {note.branch}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Actions: View Online + Download PDF */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <span>💾 {note.file_size || "3.5 MB"}</span>
                  <span>{note.pages ? `${note.pages} pages` : "Complete"} • {note.downloads || 450} views</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  {/* VIEW ONLINE BUTTON */}
                  <button
                    onClick={() => {
                      setActiveViewerNote(note);
                      setViewerMode("reader");
                    }}
                    className="px-3 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold transition shadow-sm shadow-amber-600/20 flex items-center justify-center gap-1.5"
                  >
                    <span>👁️</span>
                    <span>View Online</span>
                  </button>

                  {/* DOWNLOAD PDF BUTTON */}
                  <button
                    onClick={() => handleDownloadNote(note)}
                    className="px-3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition shadow-sm shadow-emerald-600/20 flex items-center justify-center gap-1.5"
                  >
                    <span>⬇️</span>
                    <span>Download</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========================================================================= */}
      {/* IN-APP ONLINE STUDY NOTES READER & PDF VIEWER MODAL */}
      {/* ========================================================================= */}
      {activeViewerNote && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden">
          <div
            ref={modalContainerRef}
            className="relative bg-slate-900 text-white rounded-3xl overflow-hidden w-full max-w-6xl h-[94vh] flex flex-col border border-slate-700 shadow-2xl animate-in fade-in zoom-in-95 duration-150"
          >
            {/* MODAL HEADER BAR */}
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-600 to-orange-500 flex items-center justify-center text-lg font-bold shadow-md flex-shrink-0">
                  📖
                </div>
                <div className="truncate">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-950 text-amber-300 border border-amber-800/60">
                      {activeViewerNote.semester}
                    </span>
                    <span className="text-xs text-amber-400 font-semibold">
                      ★ {activeViewerNote.rating || "5.0"}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm sm:text-base text-white truncate mt-0.5">
                    {activeViewerNote.title}
                  </h3>
                  <p className="text-xs text-slate-400 truncate">
                    {activeViewerNote.subject} • {activeViewerNote.branch}
                  </p>
                </div>
              </div>

              {/* Mode Switcher Tabs & Actions */}
              <div className="flex items-center gap-2 flex-wrap justify-between md:justify-end">
                <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-bold">
                  <button
                    onClick={() => setViewerMode("reader")}
                    className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1 ${
                      viewerMode === "reader"
                        ? "bg-amber-600 text-white shadow-sm"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <span>📖</span>
                    <span>Online Reader</span>
                  </button>

                  <button
                    onClick={() => setViewerMode("pdf")}
                    className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1 ${
                      viewerMode === "pdf"
                        ? "bg-amber-600 text-white shadow-sm"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <span>📄</span>
                    <span>PDF Viewer</span>
                  </button>

                  <button
                    onClick={() => setViewerMode("formulas")}
                    className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1 ${
                      viewerMode === "formulas"
                        ? "bg-amber-600 text-white shadow-sm"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <span>📑</span>
                    <span>Formulas & Exam Qs</span>
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleCopyNotes(activeViewerNote)}
                    title="Copy full study note text"
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs border border-slate-700 transition"
                  >
                    📋
                  </button>

                  <button
                    onClick={() => handleDownloadNote(activeViewerNote)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-sm flex items-center gap-1"
                  >
                    <span>⬇️</span>
                    <span className="hidden sm:inline">Download</span>
                  </button>

                  <button
                    onClick={toggleFullscreen}
                    title="Toggle Fullscreen"
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs border border-slate-700 transition hidden sm:flex"
                  >
                    {isFullscreen ? "🗗" : "⛶"}
                  </button>

                  <button
                    onClick={() => setActiveViewerNote(null)}
                    title="Close (Esc)"
                    className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-rose-600 text-white flex items-center justify-center font-bold text-sm transition border border-slate-700"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>

            {/* MODAL BODY */}
            <div className="flex-1 overflow-y-auto bg-slate-950 p-4 sm:p-6 text-slate-200">
              {/* ---------------------------------------------------- */}
              {/* MODE 1: ONLINE STUDY READER (CLEAN DOCUMENT MODE) */}
              {/* ---------------------------------------------------- */}
              {viewerMode === "reader" && (
                <div className="max-w-4xl mx-auto space-y-6">
                  {/* Top Note Overview Card */}
                  <div className="bg-gradient-to-br from-slate-900 to-slate-850 p-6 rounded-3xl border border-slate-800 shadow-lg space-y-3">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <img
                          src={
                            activeViewerNote.uploader_avatar ||
                            "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"
                          }
                          alt={activeViewerNote.uploader}
                          className="w-8 h-8 rounded-full object-cover border border-amber-500/40"
                        />
                        <div>
                          <p className="text-xs font-bold text-white">
                            {activeViewerNote.uploader}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            Verified Contributor • {activeViewerNote.university}
                          </p>
                        </div>
                      </div>

                      {/* Font Size Adjuster Controls */}
                      <div className="flex items-center gap-1.5 bg-slate-950 px-2 py-1 rounded-xl border border-slate-800 text-xs">
                        <span className="text-[10px] text-slate-400 mr-1">Text Size:</span>
                        <button
                          onClick={() => setReaderFontSize("text-xs")}
                          className={`px-2 py-0.5 rounded ${
                            readerFontSize === "text-xs" ? "bg-amber-600 text-white" : "text-slate-400"
                          }`}
                        >
                          A-
                        </button>
                        <button
                          onClick={() => setReaderFontSize("text-sm")}
                          className={`px-2 py-0.5 rounded ${
                            readerFontSize === "text-sm" ? "bg-amber-600 text-white" : "text-slate-400"
                          }`}
                        >
                          A
                        </button>
                        <button
                          onClick={() => setReaderFontSize("text-base")}
                          className={`px-2 py-0.5 rounded ${
                            readerFontSize === "text-base" ? "bg-amber-600 text-white" : "text-slate-400"
                          }`}
                        >
                          A+
                        </button>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-2 border-t border-slate-800">
                      {activeViewerNote.summary}
                    </p>
                  </div>

                  {/* Units / Chapters List */}
                  {activeViewerNote.units && activeViewerNote.units.length > 0 ? (
                    <div className="space-y-6">
                      {activeViewerNote.units.map((unit, idx) => (
                        <div
                          key={idx}
                          className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 space-y-4 shadow-md"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs border border-amber-500/30">
                                U{unit.unit_number || idx + 1}
                              </span>
                              <h4 className="font-bold text-sm sm:text-base text-white">
                                {unit.title}
                              </h4>
                            </div>
                            <span className="text-[10px] px-2 py-0.5 bg-slate-800 text-slate-400 rounded-md">
                              Unit {unit.unit_number || idx + 1}
                            </span>
                          </div>

                          <p className={`text-slate-300 leading-relaxed ${readerFontSize}`}>
                            {unit.description}
                          </p>

                          {/* Key Topics List */}
                          {unit.key_topics && unit.key_topics.length > 0 && (
                            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 space-y-2">
                              <p className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                                📌 Key Examination Concepts:
                              </p>
                              <ul className="space-y-1.5 pl-2">
                                {unit.key_topics.map((topic, tIdx) => (
                                  <li
                                    key={tIdx}
                                    className={`text-slate-300 flex items-start gap-2 ${readerFontSize}`}
                                  >
                                    <span className="text-amber-500 mt-1">•</span>
                                    <span>{topic}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Code Sample */}
                          {unit.code_sample && (
                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                                <span>💻 Code Implementation & Syntax</span>
                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(unit.code_sample);
                                    setCopiedToast("Code snippet copied! 💻");
                                    setTimeout(() => setCopiedToast(""), 2500);
                                  }}
                                  className="text-amber-400 hover:underline flex items-center gap-1"
                                >
                                  <span>📋</span> Copy Code
                                </button>
                              </div>
                              <pre className="bg-slate-950 text-amber-200 p-4 rounded-2xl text-xs font-mono overflow-x-auto border border-slate-800 leading-relaxed">
                                <code>{unit.code_sample}</code>
                              </pre>
                            </div>
                          )}

                          {/* Exam Tips Callout */}
                          {unit.exam_tips && (
                            <div className="bg-amber-950/30 border border-amber-800/50 p-3.5 rounded-2xl flex items-start gap-2.5 text-xs text-amber-200">
                              <span className="text-base">💡</span>
                              <div>
                                <span className="font-bold text-amber-300 block">
                                  University Exam Strategy:
                                </span>
                                <span>{unit.exam_tips}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-3">
                      <p className="text-3xl">📄</p>
                      <h4 className="font-bold text-base text-white">
                        Full PDF Available in PDF Viewer Mode
                      </h4>
                      <p className="text-xs text-slate-400 max-w-md mx-auto">
                        This study note contains complete handwritten/typed materials. Switch to 'PDF Viewer' mode above to view all embedded pages.
                      </p>
                      <button
                        onClick={() => setViewerMode("pdf")}
                        className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition shadow-md"
                      >
                        Switch to PDF Viewer Mode ↗
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* ---------------------------------------------------- */}
              {/* MODE 2: EMBEDDED PDF DOCUMENT VIEWER */}
              {/* ---------------------------------------------------- */}
              {viewerMode === "pdf" && (
                <div className="w-full h-full flex flex-col relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
                  {/* PDF Toolbar Notice */}
                  <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs text-slate-300 flex-wrap gap-2">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span>
                        Viewing: <strong>{activeViewerNote.title}</strong>
                      </span>
                    </span>
                    <div className="flex items-center gap-2">
                      <a
                        href={resolvePdfUrl(activeViewerNote.file_url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 transition flex items-center gap-1"
                      >
                        <span>Open in New Tab ↗</span>
                      </a>
                      <button
                        onClick={() => handleDownloadNote(activeViewerNote)}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1"
                      >
                        <span>⬇️ Download PDF</span>
                      </button>
                    </div>
                  </div>

                  {/* Embedded PDF iframe */}
                  <div className="flex-1 w-full h-[70vh] bg-slate-950 relative">
                    <iframe
                      src={resolvePdfUrl(activeViewerNote.file_url)}
                      title={activeViewerNote.title}
                      className="w-full h-full border-0"
                      allow="autoplay"
                    ></iframe>
                  </div>
                </div>
              )}

              {/* ---------------------------------------------------- */}
              {/* MODE 3: FORMULAS, CHEAT SHEET & UNIVERSITY EXAM Qs */}
              {/* ---------------------------------------------------- */}
              {viewerMode === "formulas" && (
                <div className="max-w-4xl mx-auto space-y-6">
                  {/* Key Formulas Section */}
                  <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
                    <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                      <span className="text-xl">📐</span>
                      <div>
                        <h4 className="font-bold text-base text-white">
                          High-Yield Formulas & Definitions
                        </h4>
                        <p className="text-xs text-slate-400">
                          Quick revision cheat sheet for {activeViewerNote.subject}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 pt-2">
                      {(activeViewerNote.key_formulas && activeViewerNote.key_formulas.length > 0
                        ? activeViewerNote.key_formulas
                        : [
                            "Core Formula / Algorithm Definition: Review unit formulas and boundary rules.",
                            "Time & Space Complexities: Verify Worst, Average and Best case analysis.",
                            "Examination Proofs: Study theorems and step-by-step derivations."
                          ]
                      ).map((formula, fIdx) => (
                        <div
                          key={fIdx}
                          className="bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-xs text-amber-300 flex items-start gap-3"
                        >
                          <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                            {fIdx + 1}
                          </span>
                          <span className="leading-relaxed mt-0.5">{formula}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Frequently Asked End-Term Exam Questions */}
                  <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
                    <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                      <span className="text-xl">❓</span>
                      <div>
                        <h4 className="font-bold text-base text-white">
                          Frequently Asked University Exam Questions
                        </h4>
                        <p className="text-xs text-slate-400">
                          Compiled from Graphic Era Deemed & Hill University end-term papers
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3 pt-2">
                      {(activeViewerNote.exam_questions && activeViewerNote.exam_questions.length > 0
                        ? activeViewerNote.exam_questions
                        : [
                            "Explain the core principles and architectural diagram of this subject with an example.",
                            "Compare and contrast the primary algorithms/methods with time-space trade-offs."
                          ]
                      ).map((q, qIdx) => (
                        <div
                          key={qIdx}
                          className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2"
                        >
                          <div className="flex items-start gap-2.5">
                            <span className="text-xs font-bold text-amber-400 bg-amber-950 px-2 py-0.5 rounded-md flex-shrink-0">
                              Q{qIdx + 1}
                            </span>
                            <p className="text-xs sm:text-sm font-semibold text-slate-200 leading-relaxed">
                              {q}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* MODAL FOOTER */}
            <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 flex-wrap gap-2">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                <span>Graphic Era Online Interactive Document Viewer Active</span>
              </span>
              <span className="text-[11px] text-slate-500">
                Press <strong>Esc</strong> or click <strong>✕</strong> to return to study notes
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Notes;

