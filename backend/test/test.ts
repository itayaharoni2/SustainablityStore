import fetch from "node-fetch";

interface TestCase {
  name: string;
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  params?: Record<string, string>;
  body?: object;
  expectedStatus: number;
  requiresAuth: boolean;
  validate?: (data: any) => boolean;
}

const baseUrl = "http://localhost:8000"; // Replace with your server's URL

// Add your login credentials
const loginCredentials = {
  email: "admin",
  password: "admin",
  remember: false,
};

const testCases: TestCase[] = [
  {
    name: "Login",
    endpoint: "/auth/sign-in",
    method: "POST",
    body: loginCredentials,
    expectedStatus: 200,
    requiresAuth: false,
  },
  {
    name: "Get user activities",
    endpoint: "/user/activities",
    method: "GET",
    expectedStatus: 200,
    requiresAuth: true,
    validate: (data) => {
      return (
        data.success === true &&
        Array.isArray(data.activities) &&
        data.activities.every(
          (activity: any) =>
            typeof activity.id === "string" &&
            typeof activity.userId === "string" &&
            activity.user &&
            typeof activity.user.id === "string" &&
            typeof activity.user.name === "string" &&
            typeof activity.user.email === "string" &&
            typeof activity.user.category === "string" &&
            typeof activity.user.isAdmin === "boolean"
        )
      );
    },
  },
  {
    name: "Get products with filters",
    endpoint: "/products/filters",
    method: "GET",
    params: {
      "category[name]": "Reducing Plastic Use",
      "category[selected]": "true",
      "price[0]": "0",
      "price[1]": "1000",
      sort: "price-asc",
      page: "1",
      pageSize: "10",
    },
    expectedStatus: 200,
    requiresAuth: false,
    validate: (data) => {
      return (
        Array.isArray(data.products) &&
        typeof data.pagination === "object" &&
        typeof data.pagination.currentPage === "number" &&
        typeof data.pagination.pageSize === "number" &&
        typeof data.pagination.totalCount === "number" &&
        typeof data.pagination.totalPages === "number"
      );
    },
  },
  {
    name: "Get products (no category)",
    endpoint: "/products",
    method: "GET",
    expectedStatus: 200,
    requiresAuth: false,
    validate: (data) => {
      return (
        data.success === true &&
        Array.isArray(data.products) &&
        data.products.length <= 8
      );
    },
  },
  {
    name: "Get products (with category)",
    endpoint: "/products",
    method: "GET",
    params: { category: "Reducing Plastic Use" },
    expectedStatus: 200,
    requiresAuth: false,
    validate: (data) => {
      return (
        data.success === true &&
        Array.isArray(data.products) &&
        data.products.length <= 8 &&
        data.products.some(
          (product: any) => product.category === "Reducing Plastic Use"
        )
      );
    },
  },
  {
    name: "Search products",
    endpoint: "/products/search",
    method: "GET",
    params: { q: "stain", page: "1", pageSize: "10" },
    expectedStatus: 200,
    requiresAuth: false,
    validate: (data) => {
      return (
        Array.isArray(data.products) &&
        typeof data.pagination === "object" &&
        typeof data.pagination.currentPage === "number" &&
        typeof data.pagination.pageSize === "number" &&
        typeof data.pagination.totalCount === "number" &&
        typeof data.pagination.totalPages === "number"
      );
    },
  },
  {
    name: "Get product by ID",
    endpoint: "/products/cm0ohumsb000fqikaeu3va4k3",
    method: "GET",
    expectedStatus: 200,
    requiresAuth: false,
    validate: (data) => {
      return (
        data.success === true &&
        typeof data.product === "object" &&
        typeof data.product.id === "string" &&
        typeof data.product.name === "string" &&
        typeof data.product.description === "string" &&
        typeof data.product.price === "number" &&
        typeof data.product.category === "string"
      );
    },
  },
  {
    name: "Get all reviews",
    endpoint: "/review",
    method: "GET",
    expectedStatus: 200,
    requiresAuth: false,
    validate: (data) => {
      return (
        data.success === true &&
        Array.isArray(data.data) &&
        data.data.every(
          (review: any) =>
            typeof review.id === "string" &&
            typeof review.userId === "string" &&
            typeof review.orderId === "string" &&
            typeof review.productId === "string" &&
            typeof review.rating === "number" &&
            typeof review.comment === "string" &&
            review.user &&
            typeof review.user.id === "string" &&
            typeof review.user.name === "string" &&
            typeof review.user.email === "string" &&
            typeof review.user.category === "string" &&
            typeof review.user.isAdmin === "boolean"
        )
      );
    },
  },
  // {
  //   name: "Create new review",
  //   endpoint: "/review",
  //   method: "POST",
  //   body: {
  //     orderId: "order123",
  //     productId: "product456",
  //     rating: 5,
  //     comment: "Great product!",
  //   },
  //   expectedStatus: 201,
  //   requiresAuth: true,
  //   validate: (data) => {
  //     return (
  //       data.success === true &&
  //       data.data &&
  //       typeof data.data.id === "string" &&
  //       typeof data.data.userId === "string" &&
  //       data.data.orderId === "order123" &&
  //       data.data.productId === "product456" &&
  //       data.data.rating === 5 &&
  //       data.data.comment === "Great product!"
  //     );
  //   },
  // },
  // {
  //   name: "Create duplicate review (should fail)",
  //   endpoint: "/review",
  //   method: "POST",
  //   body: {
  //     orderId: "order123",
  //     productId: "product456",
  //     rating: 4,
  //     comment: "Trying to add another review",
  //   },
  //   expectedStatus: 200, // The API returns 200 even for this error
  //   requiresAuth: true,
  //   validate: (data) => {
  //     return (
  //       data.success === false &&
  //       data.error === "You have already reviewed this product"
  //     );
  //   },
  // },
];

async function login(): Promise<string | null> {
  const loginCase = testCases.find((test) => test.name === "Login");
  if (!loginCase) {
    console.error("Login test case not found");
    return null;
  }

  try {
    const response = await fetch(`${baseUrl}${loginCase.endpoint}`, {
      method: loginCase.method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginCase.body),
    });

    if (response.status !== loginCase.expectedStatus) {
      console.error(
        `Login failed. Expected status ${loginCase.expectedStatus}, got ${response.status}`
      );
      return null;
    }

    const cookies = response.headers.get("set-cookie");
    if (!cookies) {
      console.error("No cookie received from login");
      return null;
    }

    console.log("Login successful");
    return cookies;
  } catch (error) {
    console.error("Error during login:", error);
    return null;
  }
}

async function runTest(testCase: TestCase, authCookie: string | null) {
  console.log("--------------------------------------");
  const {
    name,
    endpoint,
    method,
    body,
    expectedStatus,
    requiresAuth,
    validate,
  } = testCase;
  const url = `${baseUrl}${endpoint}`;

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (requiresAuth && authCookie) {
      headers["Cookie"] = authCookie;
    }

    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    const statusMatch = response.status === expectedStatus;
    console.log(`${name}: ${statusMatch ? "PASSED" : "FAILED"}`);
    console.log(
      `  Expected status: ${expectedStatus}, Actual status: ${response.status}`
    );

    if (response.status !== 204) {
      // No content for 204 status
      const data = await response.json();
      console.log("  Response data:", data);

      if (validate) {
        const isValid = validate(data);
        console.log(`  Data validation: ${isValid ? "PASSED" : "FAILED"}`);
      }
    }

    console.log(""); // Empty line for readability
  } catch (error) {
    console.error(`Error in "${name}":`, error);
  }
}

async function runAllTests() {
  const authCookie = await login();

  if (!authCookie) {
    console.error("Authentication failed. Aborting tests.");
    return;
  }

  for (const testCase of testCases) {
    if (testCase.name !== "Login") {
      // Skip the login test as we've already done it
      await runTest(testCase, authCookie);
    }
  }
}

runAllTests().catch(console.error);
