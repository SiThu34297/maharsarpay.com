export type DemoUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  image?: string;
};

const fallbackUsers: DemoUser[] = [
  {
    id: "demo-reader",
    name: "Demo Reader",
    email: "reader@maharsarpay.com",
    password: "demo1234",
    image: "/images/home/real/authors/author-1.jpg",
  },
];

function getConfiguredUser(): DemoUser | null {
  const email = process.env.AUTH_DEMO_EMAIL;
  const password = process.env.AUTH_DEMO_PASSWORD;

  if (!email || !password) {
    return null;
  }

  return {
    id: process.env.AUTH_DEMO_USER_ID ?? "configured-demo-user",
    name: process.env.AUTH_DEMO_NAME ?? "Demo Reader",
    email,
    password,
    image: process.env.AUTH_DEMO_IMAGE ?? "/images/home/real/authors/author-2.jpg",
  };
}

export function getDemoUsers(): DemoUser[] {
  const configuredUser = getConfiguredUser();

  return configuredUser ? [configuredUser] : fallbackUsers;
}

export function findDemoUserByEmail(email: string): DemoUser | null {
  return getDemoUsers().find((user) => user.email.toLowerCase() === email.toLowerCase()) ?? null;
}

export function verifyDemoCredentials(email: string, password: string): DemoUser | null {
  const user = findDemoUserByEmail(email);

  if (!user || user.password !== password) {
    return null;
  }

  return user;
}
