export const auth={
    LOGIN:'/api/auth/login',
    SIGNUP:'/api/auth/signup',
}

export const questionEndpoint={
    PAGINATED:'/api/questions/list',
    QUESTION:'/api/questions',
    SINGLE: (id: string) => `/api/questions/${id}`,
    VOTE: (id: string) => `/api/questions/${id}/vote`,
    ANSWERS: (id: string) => `/api/questions/${id}/answers`,
}

export const answers={
    VOTE: (id: string) => `/api/answers/${id}/vote`,
}