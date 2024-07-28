# [StreamCool](https://streamcool.pro/) API Documentation

Welcome to the StreamCool.Pro API documentation! This API provides access to Asian drama content scraped from [Streamcool](https://streamcool.pro/). Below are the available endpoints along with brief descriptions:

## Deployment 🚀

### 1. Docker Deployment

If you prefer Docker deployment, follow these steps:

1. Ensure you have Docker installed on your system.
2. Create a Dockerfile in your project directory with the provided content.
3. Modify your package.json file to include necessary scripts for Docker deployment.
4. Build your Docker image with `docker build -t pladrac-api .`.
5. Run your Docker container with `docker run -p 3000:3000 pladrac-api`.

Your Pladrac API should now be accessible at http://localhost:3000.

### 2. Manual Deployment

For manual deployment, follow these steps:

1. Clone the repository:
   ```
   git clone https://github.com/Snowball-01/AsianDrama-API.git
   ```
2. Navigate to the project directory:
   ```
   cd AsianDrama-API
   ```
3. Install dependencies:

   ```
   npm install
   ```

4. For development mode, run:

   ```
   npm run start:dev
   ```

5. For production mode, build the project:

   ```
   npm run build
   ```

6. Then start the production server:

   ```
   npm run start:prod
   ```

### 3. Heroku Deploy
<a href="https://www.heroku.com/deploy?template=https://github.com/Snowball-01/Asian-Drama-API">
  <img src="https://www.herokucdn.com/deploy/button.svg" alt="Deploy">
</a>


## Endpoints 🚀

### `/asiandrama/get`

- **Description:** Retrieves detailed information about a specific Asian drama based on its ID.
- **Usage:** Send a GET request to `/asiandrama/get` with the drama ID as a parameter.
- **Example:** `/asiandrama/get?id=men-in-love-2024-episode-3023`

### `/asiandrama/search`

- **Description:** Allows searching for Asian dramas based on keywords.
- **Usage:** Send a GET request to `/asiandrama/search` with the search query as a parameter.
- **Example:** `/asiandrama/search?key=Friends&page=2`
- **Note:** For `Movies` or `Kshow` or `Ongoing` or `Popular` pages just use `key=movies` or `key=kshow` or `key=ongoing` or `key=popular` respectively.

### `/asiandrama/random`

- **Description:** Retrieves a random Asian drama from the database.
- **Usage:** Send a GET request to `/asiandrama/random`.
- **Example:** `/asiandrama/random?&page=1`

## Additional Information ℹ️

- **CORS:** Cross-Origin Resource Sharing is enabled for all endpoints.
- **Rate Limiting:** Endpoints are rate-limited to prevent abuse and ensure fair usage.
- **Response Format:** All responses are returned in JSON format.

## Rate Limiting 🕒

To maintain service quality and availability for all users, rate limiting is applied to the API endpoints. Please adhere to the following limits:

- **Requests:** Limited to X requests per Y seconds.
- **Exceeding Limits:** If you exceed the rate limits, you'll receive a `429 Too Many Requests` status code.

## Disclaimer ❗

This API is provided for educational and informational purposes only. Usage of the API is subject to the terms and conditions outlined by Pladrac. We do not guarantee the accuracy or availability of the data provided by this API.

## Contact 📧

For any inquiries or support related to the [Streamcool](https://streamcool.pro/) API, please contact [Snowball](https://t.me/Snowball_Official).

---

© 2024 [Streamcool](https://streamcool.pro/) . All rights reserved.
