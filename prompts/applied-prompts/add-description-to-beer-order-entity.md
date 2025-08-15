# Prompt Variables
Apply the following variables to placeholders in the prompt.  Placeholders are denoted by `${variable}`.

# Placeholders Definitions
The following key value pairs are used to replace placeholders in the prompt.  Format variable defines the variable
name, and value defines the value to replace the placeholder with.  Defined as `variable name` = `value` pairs in the
following list:

* entity_name = `BeerOrder`
* property_name = `description`
* property_type = `String`

## Task Description
Your task is to add a new property to the JPA Entity `${entity_name}`. The property name to add is `${property_type}
` with a type of `${property_type}`. Use guidelines from the file `.junie/guidelines.md`.

### Task Steps
* Create a new flyway migration script to add the`${property_name}` property to the database table.
* Update the JPA Entity with the new property named `${property_name}`.
* Update the corresponding DTO with the new property named `${property_name}`.
* Update the OpenAPI documentation with the new property named `${property_name}`.
* Verify all tests are passing.
* Verify the OpenAPI specification is valid.