import os
import shutil

def create_simple_pdf(filepath, title, subject, semester, content_lines):
    text_commands = [
        f"BT",
        f"/F1 16 Tf",
        f"50 760 Td",
        f"({title}) Tj",
        f"/F1 11 Tf",
        f"0 -24 Td",
        f"(Subject: {subject}  |  Semester: {semester}) Tj",
        f"0 -18 Td",
        f"(Graphic Era Deemed & Hill University - Verified Academic Notes) Tj",
        f"0 -28 Td",
        f"/F1 10 Tf",
    ]
    for line in content_lines:
        safe_line = line.replace("(", "[").replace(")", "]").replace("\\", "/")
        text_commands.append(f"({safe_line}) Tj")
        text_commands.append("0 -16 Td")
    text_commands.append("ET")
    
    stream_content = "\n".join(text_commands).encode("latin1")
    stream_len = len(stream_content)
    
    pdf_content = (
        b"%PDF-1.4\n"
        b"1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n"
        b"2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n"
        b"3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n"
        b"4 0 obj\n<< /Length " + str(stream_len).encode("ascii") + b" >>\nstream\n" +
        stream_content +
        b"\nendstream\nendobj\n"
        b"5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n"
        b"xref\n0 6\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \n"
        b"0000000244 00000 n \n0000000350 00000 n \ntrailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n430\n%%EOF\n"
    )
    
    with open(filepath, "wb") as f:
        f.write(pdf_content)
    print(f"Created PDF: {os.path.basename(filepath)}")

backend_uploads = r"C:\Users\admin\Desktop\college-social-platform\backend\uploads\notes"
frontend_uploads = r"C:\Users\admin\Desktop\college-social-platform\frontend\public\uploads\notes"
os.makedirs(backend_uploads, exist_ok=True)
os.makedirs(frontend_uploads, exist_ok=True)

notes_data = [
    ("Array.pdf", "C Programming: Array Fundamentals & Operations", "Programming for Problem Solving (TCS 101)", "1st Semester", [
        "Unit 1: Introduction to 1D and 2D Arrays in C - Declaration, Initialization and Memory Layout",
        "Unit 2: Array Operations - Traversal, Insertion, Deletion, Searching [Linear & Binary Search]",
        "Unit 3: Matrix Operations in C - Matrix Addition, Multiplication, Transpose and Sparse Representation",
        "Unit 4: Multi-dimensional Arrays and Array of Strings [2D char arrays]",
        "Unit 5: Common University Exam Questions & Solved Lab Programs on Arrays"
    ]),
    ("Functions.pdf", "Functions, Recursion & Modular Programming in C", "Programming for Problem Solving (TCS 101)", "1st Semester", [
        "Unit 1: Function Declaration, Definition, Calling & Return Types in C",
        "Unit 2: Call by Value vs Call by Reference Parameter Passing Mechanism",
        "Unit 3: Recursion: Base Case, Recursive Step, Tower of Hanoi & Fibonacci Sequences",
        "Unit 4: Storage Classes in C - auto, register, static, extern with Lifetime & Scope",
        "Unit 5: Modular Programming, Header Files, Preprocessor Directives (#define, #include)"
    ]),
    ("Pointers.pdf", "Pointers & Dynamic Memory Allocation in C", "Programming for Problem Solving (TCS 101)", "1st Semester", [
        "Unit 1: Pointer Syntax, Address-of (&) and Dereference (*) Operators",
        "Unit 2: Pointer Arithmetic, Pointers with 1D/2D Arrays and Array of Pointers",
        "Unit 3: Function Pointers and Passing Pointers to Functions",
        "Unit 4: Dynamic Memory Allocation - malloc(), calloc(), realloc(), free()",
        "Unit 5: Common Pointer Errors: Dangling Pointers, Memory Leaks, Wild Pointers & Best Practices"
    ]),
    ("All_in_one_components.pdf", "Computer Engineering Fundamentals & Hardware Components", "Basic Electrical & Electronics (TEC 101)", "1st Semester", [
        "Unit 1: Digital Logic Gates, Boolean Algebra, Truth Tables, K-Maps Simplification",
        "Unit 2: Combinational Circuits - Multiplexers, De-multiplexers, Encoders, Decoders, Adders",
        "Unit 3: Sequential Circuits - RS, JK, D, T Flip-Flops and Shift Registers",
        "Unit 4: Computer Architecture Basics - CPU Registers, ALU, Bus Structure & Memory Hierarchy",
        "Unit 5: Semiconductor Devices: Diodes, Transistors, Rectifiers and Voltage Regulators"
    ]),
    ("Math1_Calculus.pdf", "Engineering Mathematics I: Matrices & Calculus", "Engineering Mathematics I (TMA 101)", "1st Semester", [
        "Unit 1: Matrices: Rank of Matrix, System of Linear Equations, Cayley-Hamilton Theorem",
        "Unit 2: Differential Calculus: Successive Differentiation, Leibnitz Theorem, Rolle's & Mean Value Theorems",
        "Unit 3: Partial Differentiation: Euler's Theorem for Homogeneous Functions, Jacobians & Errors",
        "Unit 4: Multiple Integrals: Double & Triple Integrals, Change of Order of Integration, Volume calculation",
        "Unit 5: Vector Calculus: Gradient, Divergence, Curl, Green's, Gauss and Stokes' Theorems"
    ]),
    ("OOP_CPP_Notes.pdf", "Object Oriented Programming with C++", "Object Oriented Programming (TCS 201)", "2nd Semester", [
        "Unit 1: OOP Concepts: Classes, Objects, Encapsulation, Data Abstraction",
        "Unit 2: Constructors, Destructors, Copy Constructor, Friend Functions and Classes",
        "Unit 3: Inheritance (Single, Multiple, Multilevel, Hierarchical, Hybrid) & Virtual Base Classes",
        "Unit 4: Polymorphism: Function Overloading, Operator Overloading, Virtual Functions, Abstract Classes",
        "Unit 5: Templates (Function & Class Templates), Standard Template Library (STL) & Exception Handling"
    ]),
    ("Math2_Differential.pdf", "Engineering Mathematics II: Differential Equations & Transforms", "Engineering Mathematics II (TMA 201)", "2nd Semester", [
        "Unit 1: Ordinary Differential Equations of First Order and First Degree (Exact, Linear, Bernoulli)",
        "Unit 2: Linear Differential Equations of Higher Order with Constant Coefficients & Cauchy-Euler Equations",
        "Unit 3: Laplace Transforms: Properties, Periodic Functions, Inverse Laplace & Convolution Theorem",
        "Unit 4: Applications of Laplace Transforms to Differential Equations with Initial Values",
        "Unit 5: Fourier Series: Euler's Formulae, Dirichlet's Conditions, Half Range Sine and Cosine Series"
    ]),
    ("DS_Notes.pdf", "Data Structures with C: Stacks, Queues, Trees & Graphs", "Data Structures (TCS 301)", "3rd Semester", [
        "Unit 1: Linear Data Structures: Arrays, Singly, Doubly and Circular Linked Lists",
        "Unit 2: Stacks & Queues: Infix to Postfix Conversion, Evaluation, Circular & Priority Queues",
        "Unit 3: Trees: Binary Trees, Binary Search Trees (BST), AVL Trees, Tree Traversals (Inorder, Preorder, Postorder)",
        "Unit 4: Graphs: Representation (Adjacency Matrix & List), BFS, DFS, Dijkstra Shortest Path",
        "Unit 5: Hashing Techniques, Collision Resolution (Chaining, Open Addressing) and Sorting Algorithms"
    ]),
    ("Discrete_Math.pdf", "Discrete Structures & Graph Theory", "Discrete Structures (TCS 302)", "3rd Semester", [
        "Unit 1: Set Theory, Relations, Equivalence Relations, Partial Orders, Lattices and Functions",
        "Unit 2: Propositional Logic: Tautology, Contradiction, Normal Forms, Predicate Calculus",
        "Unit 3: Algebraic Structures: Semi-groups, Monoids, Groups, Subgroups, Cosets, Lagrange's Theorem",
        "Unit 4: Recurrence Relations and Generating Functions",
        "Unit 5: Graph Theory: Planar Graphs, Euler Paths, Hamiltonian Cycles, Graph Coloring, Trees"
    ]),
    ("OS_Notes.pdf", "Operating Systems: Process Synchronization & Memory Management", "Operating Systems (TCS 404)", "4th Semester", [
        "Unit 1: Process Management & CPU Scheduling Algorithms (FCFS, SJF, Round Robin)",
        "Unit 2: Inter-process Communication, Critical Section Problem & Semaphores",
        "Unit 3: Deadlock Characterization, Prevention, Avoidance (Banker's Algorithm)",
        "Unit 4: Memory Management - Paging, Segmentation & Virtual Memory (LRU, FIFO)",
        "Unit 5: File Systems, Storage Structure and Disk Scheduling (SCAN, C-SCAN)"
    ]),
    ("DBMS_Notes.pdf", "Database Management Systems: SQL, Normalization & ACID", "Database Management Systems (TCS 403)", "4th Semester", [
        "Unit 1: ER-Modeling, Relational Algebra, and Relational Calculus",
        "Unit 2: SQL Query Optimization, Joins, Triggers, Views & Subqueries",
        "Unit 3: Functional Dependencies and Normalization (1NF, 2NF, 3NF, BCNF, 4NF)",
        "Unit 4: Transaction Processing & ACID Properties (Atomicity, Consistency, Isolation, Durability)",
        "Unit 5: Concurrency Control (2PL, Timestamp Ordering) & Database Recovery Techniques"
    ]),
    ("DAA_Notes.pdf", "Design & Analysis of Algorithms Complete Notes", "Design & Analysis of Algorithms (TCS 502)", "5th Semester", [
        "Unit 1: Asymptotic Notations (Big-O, Omega, Theta), Recurrence Relations & Master Theorem",
        "Unit 2: Divide and Conquer (Merge Sort, Quick Sort, Strassen's Matrix Multiplication)",
        "Unit 3: Greedy Method (Knapsack, Huffman Coding, Prim's & Kruskal's MST)",
        "Unit 4: Dynamic Programming (LCS, 0/1 Knapsack, Bellman-Ford, Floyd-Warshall)",
        "Unit 5: Branch and Bound, Backtracking (N-Queens, Graph Coloring) & NP-Completeness"
    ]),
    ("CN_Notes.pdf", "Computer Networks: OSI Model, TCP/IP & Routing", "Computer Networks (TCS 601)", "6th Semester", [
        "Unit 1: Network Architectures, OSI Reference Model vs TCP/IP Protocol Stack",
        "Unit 2: Data Link Layer - Framing, Error Detection (CRC), Flow Control (Sliding Window)",
        "Unit 3: Network Layer - IPv4/IPv6 Addressing, Subnetting, Routing (Dijkstra, Distance Vector)",
        "Unit 4: Transport Layer - TCP vs UDP, Connection Management, Congestion Control",
        "Unit 5: Application Layer Protocols (HTTP, DNS, SMTP, FTP) & Network Security Basics"
    ]),
    ("Cloud_BigData.pdf", "Cloud Computing Architecture & Big Data Analytics", "Cloud Computing (TCS 701)", "7th Semester", [
        "Unit 1: Cloud Service Models (IaaS, PaaS, SaaS) and Deployment Models (Public, Private, Hybrid)",
        "Unit 2: Virtualization Technologies: Hypervisors (Type 1 & 2), Containerization & Docker Basics",
        "Unit 3: Distributed File Systems: Hadoop Distributed File System (HDFS) & MapReduce Framework",
        "Unit 4: Cloud Storage, NoSQL Databases (MongoDB, Cassandra) and AWS / Azure Core Services",
        "Unit 5: Cloud Security, SLA Management, Resource Scheduling and Auto-scaling"
    ]),
    ("Cyber_Security.pdf", "Information Security & Cryptography Handbook", "Cyber Security (TCS 801)", "8th Semester", [
        "Unit 1: Security Fundamentals: CIA Triad, Threat Modeling, Attack Vectors (MITM, Phishing, DDoS)",
        "Unit 2: Symmetric Cryptography: DES, 3DES, AES and Block Cipher Modes of Operation",
        "Unit 3: Asymmetric Cryptography: RSA, Diffie-Hellman Key Exchange, Elliptic Curve Cryptography",
        "Unit 4: Hash Functions (SHA-256, MD5), Message Authentication Codes (MAC) and Digital Signatures",
        "Unit 5: Network Security Protocols: SSL/TLS, IPsec, Firewalls, IDS/IPS & Ethical Hacking Basics"
    ])
]

for filename, title, subject, semester, lines in notes_data:
    b_path = os.path.join(backend_uploads, filename)
    create_simple_pdf(b_path, title, subject, semester, lines)
    f_path = os.path.join(frontend_uploads, filename)
    shutil.copy2(b_path, f_path)

print("All PDF notes generated in backend and frontend successfully!")

