# Release Process

## Version Numbering
SemVer: MAJOR.MINOR.PATCH

## Steps
1. Update CHANGELOG.md
2. Bump version in package.json
3. Create git tag
4. Push to main branch
5. Vercel auto-deploys

## Flutter Release
1. Update pubspec.yaml version
2. flutter build apk --release
3. Upload to Play Store
