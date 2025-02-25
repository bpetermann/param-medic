# Changelog

All notable changes to the "param-medic" library will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2024-02-22

### Added

- Added support for encrypted parameters via `{ hide: true, secret: 'your-secret' }`.
- Only whitelisted keys are used, all others are ignored and removed from the URL on updates.

## [0.1.1] - 2024-02-22

### Fix

- Vite plugin dts dependency

## [0.1.0] - 2024-02-22

### Added

- **`useParams`** – Hook to manage state via URL parameters, with support for retrieval, updating, and resetting.
- **`useParamContext`** – Hook to access and manipulate the parameter context dynamically.
- **`ParamContextProvider`** – Context provider to define expected keys for parameter filtering.
- **`buildUrlWithParams`** – Utility function to construct URLs with query parameters.

[0.1.0]: https://github.com/bpetermann/param-medic/releases/edit/0.1.0
[0.2.0]: https://github.com/bpetermann/param-medic/releases/edit/v0.2.0
