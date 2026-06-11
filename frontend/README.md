# e2xReviewFrontend

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.1.

## Set-Up

### Configuration

The frontend may be configured prior to the build with the environment files, located in `src/environments/`. Each of the environment file contains a different configuration. Currently, there ist one for development purposes and one for production.

There is an interface specifying, how the environment shall be configured, located at `src/app/models/Environment.ts`. 

### Building

To build the project run:

```bash
ng build
```

The build output may be found in `dist/e2x-exam-review/`. The root of the web-application may be set to `dist/e2x-exam-review/browser`. If no language is selected using by requesting a subdirectory (e.g. `/de` or `/en`), the user shall be redirected according to their preferred language (as provided by the browser). Either an especially designed index-file or some feature of the webserver may be used for redirection.

## Testing

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

### Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

### Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

## Development

### Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

### Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
