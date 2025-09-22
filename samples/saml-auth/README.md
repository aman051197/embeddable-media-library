# Embeddable Media Library - SAML Authentication Sample

This project demonstrates how to integrate SAML authentication with the Embeddable Media Library.

## Prerequisites

1. **Node.js**: Ensure you have Node.js installed on your system.
2. **Dependencies**: Install the required dependencies by running:
    ```bash
    npm install
    ```

## Setup Instructions

1. **Configure Environment Variables**:  
    Fill out the correct credentials in the `config/.env` file. The required fields include:
    - `SAML_ISSUER`
    - `SAML_ENTRY_POINT`
    - `SAML_CALLBACK_URL`

2. **Add IDP Certificate**:  
    Place the `idp-cert.cer` file under the `config` directory.

3. **Run the Application**:  
    Start the application by running:
    ```bash
    npm dev
    ```

## Folder Structure

```
/samples/saml-auth
  /config
    ├── .env          # Environment variables
    ├── idp-cert.cer  # IDP certificate file
  ├── README.md       # Project documentation
  ├── server.js       # Main application logic
  /public
    ├── index.html
```

## Notes

- Ensure the `idp-cert.cer` file matches the certificate provided by your Identity Provider (IdP).
- Double-check the `.env` file for accuracy to avoid authentication issues.

## License

This project is licensed under the MIT License.  