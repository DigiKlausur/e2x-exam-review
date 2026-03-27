const swaggerAutogen = require('swagger-autogen')({openapi: '3.1.2'});

const doc = {
    info: {
        title: 'e²x Exam Review API',
        description: 'API of the e²x Exam Review backend'
    },
    servers: [
        {
            url: 'http://{host}:{port}/api/v1',
            variables: {
                host: {
                    default: 'localhost',
                    type: 'string'
                },
                port: {
                    default: 3000,
                    type: 'number'
                }
            }
        }
    ],
    components: {
        securitySchemes:{
            bearerAuth: {
                type: 'http',
                scheme: 'bearer'
            }
        },
        '@schemas': {
            objectId: {
                type: 'string',
                description: 'object id',
                pattern: '^[0-9a-fA-F]{24}$'
            },
            user: {
                type: 'object',
                properties: {
                    _id: {
                        $ref: '#/components/schemas/objectId'
                    },
                    firstname: {
                        type: 'string',
                        required: true,
                        example: 'John'
                    },
                    lastname: {
                        type: 'string',
                        required: true,
                        example: 'Doe'
                    },
                    email: {
                        type: 'string',
                        required: true,
                        format: 'email',
                        example: 'john.doe@example.com'
                    }
                }
            },
            semester: {
                type: 'object',
                properties: {
                    year: {
                        type: 'number',
                        required: true,
                        example: 1970
                    },
                    season: {
                        type: 'string',
                        required: true,
                        enum: ['summer', 'winter']
                    }
                }
            },
            exam: {
                type: 'object',
                properties: {
                    _id: {
                        $ref: '#/components/schemas/objectId'
                    },
                    semester: {
                        $ref: '#/components/schemas/semester'
                    },
                    title: {
                        type: 'string',
                        required: true,
                        example: 'Linear Algebra'
                    },
                    date: {
                        type: 'string',
                        required: true,
                        format: 'date',
                        example: '1970-01-01'
                    },
                    primaryExaminer: {
                        required: true,
                        $ref: '#/components/schemas/user',
                    },
                    secondaryExaminer: {
                        required: true,
                        $ref: '#/components/schemas/user',
                    },
                    reviewParameters: {
                        type: 'object',
                        properties: {
                            startDate: {
                                type: 'string',
                                required: true,
                                nullable: true,
                                format: 'date',
                                example: '1970-01-01'
                            },
                            endDate: {
                                type: 'string',
                                required: true,
                                nullable: true,
                                format: 'date',
                                example: '1970-01-01'
                            },
                            showDownloadButton: {
                                type: 'boolean',
                                required: true
                            },
                            showTextLayer: {
                                type: 'boolean',
                                required: true
                            }
                        }
                    },
                    owner: {
                        required: true,
                        $ref: '#/components/schemas/user',
                    }
                }
            },
            student: {
                type: 'object',
                properties: {
                    _id: {
                        $ref: '#/components/schemas/objectId'
                    },
                    email: {
                        type: 'string',
                        format: 'email',
                        example: 'jane.smith@example.com'
                    },
                    firstname: {
                        type: 'string',
                        example: 'Jane'
                    },
                    lastname: {
                        type: 'string',
                        example: 'Smith'
                    },
                    studentId: {
                        type: 'integer',
                        required: true,
                        example: 9010000
                    }
                }
            },
            answerSheet: {
                type: 'object',
                properties: {
                    _id: {
                        $ref: '#/components/schemas/objectId'
                    },
                    exam: {
                        $ref: '#/components/schemas/exam'
                    },
                    submitter: {
                        required: true,
                        $ref: '#/components/schemas/student'
                    },
                    filePath: {
                        type: 'string',
                        required: true
                    },
                    originalFileName: {
                        type: 'string',
                        required: true
                    }
                }
            }
        }
    }
}

const outputFilePath = '../openApi.json';
const routes = ['./src/routes/managementApi.ts', './src/routes/reviewApi.ts'];

swaggerAutogen(outputFilePath, routes, doc).then(result => {
    console.log(result);
});
