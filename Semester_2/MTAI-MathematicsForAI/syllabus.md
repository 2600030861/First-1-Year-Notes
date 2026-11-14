# Maths for AI – Detailed Syllabus
*(Linear Algebra, Calculus, Optimization & Probability, taught with AI/ML meaning throughout)*

## Overview

| Module | Title | Strand |
|--------|-------|--------|
| M1 | Vectors, Matrices & Linear Systems | Linear algebra (representation) |
| M2 | Eigenvalues, SVD & PCA | Linear algebra (structure in data) |
| M3 | Multivariable Calculus | Calculus (sensitivity) |
| M4 | Optimization | Optimization (learning) |
| M5 | Probability | Probability (uncertainty) |
| M6 | From Maths to Models | Integration of all four strands |

---

## Module 1 – Vectors, Matrices & Linear Systems

### 1.1 Vectors as data
- Vectors in Rⁿ
- Vector operations
- Linear combinations
- The geometric meaning
- A data point / feature vector as a vector

### 1.2 Dot product, norms and distance
- Length
- Angle
- Cosine similarity
- Why these measure similarity between data points in AI

### 1.3 Matrices as data and as transformations
- A dataset as a matrix
- Matrix-vector multiplication
- Matrix-matrix multiplication
- Their meaning

### 1.4 Linear transformations
- How a matrix maps vectors (rotation, scaling, projection)
- Composition of transformations

### 1.5 Systems of linear equations
- Representation **Ax = b**
- Gaussian elimination
- Solution existence / uniqueness

### 1.6 Matrix inverse and determinant
- Meaning
- Computation for small matrices
- When an inverse exists

### 1.7 Vector spaces (foundational, applied, not abstract-heavy)
- Vector spaces
- Subspaces
- Span
- Linear independence
- Basis

### 1.8 Rank and the column/row space
- Rank
- Column space and row space
- The idea of dimensionality of data

### 1.9 Orthogonality and orthonormal bases
- Orthogonality
- Orthonormal bases
- Projection onto a subspace
- The basis of least-squares

### 1.10 AI/ML meaning throughout
- Features as vectors
- Datasets as matrices
- Similarity
- Why linear algebra is the language of AI

---

## Module 2 – Eigenvalues, SVD & PCA

### 2.1 Eigenvalues and eigenvectors
- Definition
- Computation for small matrices
- Geometric meaning: directions a transformation preserves

### 2.2 Diagonalisation
- Diagonalisation and its use
- Symmetric matrices and their special properties

### 2.3 Quadratic forms and positive-definiteness (foundational)
- Quadratic forms
- Positive-definiteness
- Why they appear in optimization (Module 4)

### 2.4 Singular Value Decomposition (SVD)
- The concept
- What the singular values / vectors mean
- Its central role in data

### 2.5 Principal Component Analysis (PCA) – the mathematics
- Variance
- Covariance (link to Module 5)
- How eigen / SVD finds the directions of greatest variance

### 2.6 Dimensionality reduction (conceptual)
- Why high-dimensional data can often be compressed
- What is preserved / lost

### 2.7 Matrix factorisation as a recurring AI idea
- Examples: recommendation, embeddings
- At a mathematical-foundation level

### 2.8 Numerical reality (awareness)
- Why exact hand-computation gives way to algorithms for large matrices
- Verified with NumPy

### 2.9 Norms of matrices and conditioning (awareness)
- Matrix norms
- Why some computations are sensitive

### 2.10 AI/ML meaning throughout
- PCA
- Embeddings
- Why eigen / SVD underlie how AI finds structure in data

---

## Module 3 – Multivariable Calculus

### 3.1 Limits, continuity and the derivative (consolidation)
- Limits
- Continuity
- The derivative as a rate of change
- The derivative as a slope

### 3.2 Differentiation rules and the single-variable chain rule
- Differentiation rules
- The single-variable chain rule
- Reframed as the engine of sensitivity analysis

### 3.3 Functions of several variables
- Surfaces
- Level sets
- The idea of a multivariable function
- Example: a model's error as a function of its parameters

### 3.4 Partial derivatives
- How output changes with one variable at a time

### 3.5 The gradient vector
- Direction of steepest ascent / descent
- Its central role in training

### 3.6 The multivariable chain rule
- Composing derivatives
- The mathematical heart of backpropagation (concept, not the algorithm)

### 3.7 Jacobian and Hessian (foundational)
- First- and second-order multivariable derivative information
- What they tell us

### 3.8 Taylor approximation
- Single-variable
- Introductory multivariable
- Approximating functions locally
- The basis of many optimization methods

### 3.9 Integration essentials
- The area-under-a-curve idea
- The probability link: expected values, densities (Module 5)

### 3.10 AI/ML meaning throughout
- The loss function
- Why gradients drive learning
- A first glimpse of backpropagation as the chain rule

---

## Module 4 – Optimization

### 4.1 Optimization as the core of learning
- "Training a model" = minimising a loss function
- Framing problems as optimization

### 4.2 Unconstrained optimization
- Critical points
- The role of the gradient (= 0)
- The role of the Hessian (convexity / curvature) in finding minima

### 4.3 Convexity (foundational)
- Convex sets and functions
- Why convex problems are "nice"
- Recognising convexity

### 4.4 Gradient descent
- The algorithm by hand
- Update rule
- Learning rate
- Convergence intuition

### 4.5 Variants (conceptual, awareness)
- Stochastic gradient descent
- Momentum
- Why and when, without deep algorithmics

### 4.6 Least squares as optimization
- Deriving the normal equations
- Linking to projection from Module 1
- A fully worked AI-relevant example

### 4.7 Constrained optimization (foundational)
- The idea of constraints
- Lagrange multipliers at an introductory level

### 4.8 Regularisation as an optimization idea (foundational)
- Penalising complexity (L1 / L2)
- The mathematics
- Link to ML later

### 4.9 Common pitfalls
- Local vs global minima
- Learning-rate effects
- What can go wrong (intuition for debugging models)

### 4.10 AI/ML meaning throughout
- Gradient descent **is** how neural networks and many models learn
- This module is the mathematical core of training

---

## Module 5 – Probability

### 5.1 Probability foundations
- Sample spaces
- Events
- Axioms
- Conditional probability
- A fresh, AI-oriented treatment

### 5.2 Independence and the multiplication rule
- Independence
- The multiplication rule
- The law of total probability

### 5.3 Bayes' theorem
- The mathematics of updating belief with evidence
- The foundation of Bayesian / probabilistic AI
- The naive-Bayes classifier (concept)

### 5.4 Random variables
- Discrete and continuous
- Probability mass and density functions
- Cumulative distributions

### 5.5 Expectation, variance and standard deviation
- The meaning and computation
- Their role as model summaries

### 5.6 Key distributions and where AI meets them
- Bernoulli / Binomial
- Uniform
- Gaussian / Normal (and why the Normal is everywhere)
- Poisson (awareness)

### 5.7 The Gaussian in depth (foundational)
- Its parameters
- Its shape
- Why it dominates ML
- Standardisation

### 5.8 Joint, marginal and conditional distributions
- Joint distributions
- Marginal distributions
- Conditional distributions
- Covariance and correlation (linking to PCA in Module 2)

### 5.9 The Law of Large Numbers and the Central Limit Theorem (conceptual)
- Why sampling and averages behave predictably

### 5.10 AI/ML meaning throughout
- Classification as probability
- Likelihood
- Uncertainty estimates
- The boundary to statistics / inference, which is *Mathematics for Data Science (T03)*

---

## Module 6 – From Maths to Models

### 6.1 The data-to-model pipeline mathematically
- Data as matrices / vectors
- → a model as a function
- → a loss
- → optimization
- → a trained model

### 6.2 Linear regression end-to-end
- Model
- Squared-error loss
- Solving by **normal equations** (linear algebra)
- AND solving by **gradient descent** (calculus + optimization)
- One problem, two mathematical routes

### 6.3 Logistic regression (foundational)
- The sigmoid
- A probabilistic interpretation (probability)
- Training by gradient descent
- Integrating all four strands

### 6.4 A single neuron and a tiny neural network as mathematics
- Weights as a matrix
- A forward pass as linear algebra + a nonlinearity
- The loss
- Gradients via the chain rule
- The mathematical skeleton of deep learning

### 6.5 Why these pieces fit
- Linear algebra (representation)
- Calculus (sensitivity)
- Optimization (learning)
- Probability (uncertainty)
- Seeing them work together

### 6.6 Reading the mathematics in ML documentation / papers
- Decoding the notation now that the pieces are known
- A transferable skill

### 6.7 Numerical and practical awareness
- Why libraries (NumPy and ML frameworks) implement this
- What the maths tells you when a model misbehaves

### 6.8 The bridge to the next courses
- How *Computational Foundations for AI (T03)* implements these algorithms
- How *Mathematics for Data Science (T03)* adds statistical depth

### 6.9 Limits of this course
- What is foundational here
- What is developed later: statistics, advanced optimization, full deep-learning theory

### 6.10 AI/ML meaning throughout
- This module proves the course's promise
- AI is mathematics the student can now follow end-to-end

--