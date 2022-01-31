## Run application

```bash
yarn install

cp .env.example .env

# Dev
yarn dev

# Serve to prod
yarn start
```

## Migrations

```bash
# Create
yarn migration:generate -- <name>

# Run
yarn migration:run

# Rollback
yarn migration:revert
```
