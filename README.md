Go Templates offer a versatile solution for managing the presentation layer of your application. In the realm of Go development, integrating templates is essential for creating dynamic web applications. This guide provides step-by-step instructions for installing and configuring spurtCMS Go Templates within your project structure.

**Step 1:**  
Ensure the pre-requisites of Go Environemnt is available ready in your system. Check our pre-requisites guideline for more details.
https://www.spurtcms.com/documentation/prerequisites

**Step 2:**  
To initiate the setup process, the first step involves cloning the spurtCMS Template project structure from the GIT repository https://github.com/spurtcms/spurtcms-template.

```plaintext
$git clone https://github.com/spurtcms/spurtcms-template.git
```

Upon cloning the project structure, you'll find the following directory layout in your cloned folder:

• config  
• controller  
• model  
• routes  
• storage  
• themes  
• config.json  
• main.go  
• env

**Step 3:**  
Next step is to clone the desired spurtCMS Go themes available from the GIT repository [https://github.com/spurtcms/themes.](https://github.com/spurtcms/themes.)

**Step 4:**  
By now, you have the spurtCMS template project structure and the desired spurtCMS themes available within the project. Next step is to configure the themes to get it into action.  
Within the 'themes' directory, you have the flexibility to add multiple themes tailored to your application's requirements. To specify which theme to utilize, access the 'config.json' file and modify the 'theme' attribute accordingly:

```plaintext
{ "theme": "<theme name>" }
```

For instance, you can incorporate diverse themes such as '/themes/lms', '/themes/blog', and '/themes/form', but only one theme will be rendered at a time. As an example, let us configure our LMS theme.

```plaintext
{ "theme": "/themes/lms" }
```

**Step 5:**

Executing the Application:

Once the above said theme configuration is complete, execute the following command to run the application:

```plaintext
go run main.go
```

This command initiates the Go program, ensuring that the configured theme is seamlessly integrated for rendering within the application.

Your spurtCMS template with the ready-made theme (Example: LMS) is ready to use now !!

**Conclusion:**  
By following these systematic steps, you can effortlessly set up and configure spurtCMS Go Templates within your project structure. With the ability to leverage multiple themes while rendering a singular theme at any given time, Go Templates empower developers to create dynamic and visually appealing web applications with ease.