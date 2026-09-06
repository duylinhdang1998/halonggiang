Feature: Updated profile identity and Vercel release
  Scenario: Single-line identity
    When the introduction is visible
    Then the heading reads Hà Long Giang on one line
    And HỒ SƠ NHÀ SÁNG LẬP is absent
  Scenario: Automatic Vercel build
    When a commit is pushed to main
    Then the connected Vercel project builds with npm run build:vercel
    And serves dist/vercel as the production site
