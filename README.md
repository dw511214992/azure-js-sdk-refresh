It's suggested to refresh packages one by one because some generated files may be useless. For exmaple: generated tests may override existing tests.

# Install
```shell
npm i -g azure-js-sdk-refresh
```

# Refresh all packages
command:
```shell
cd azure-sdk-for-js
refresh-all --swagger-repo=../azure-rest-api-specs --use=@autorest/typescript@6.0.0-alpha.16.20220105.1
```
The tool commits each package with commit message "refresh {package name}".

# Refresh one package
```shellhh
cd azure-sdk-for-js
refresh --swagger-repo=../azure-rest-api-specs --use=@autorest/typescript@6.0.0-alpha.16.20220105.1 --package-path=sdk/compute/arm-compute
```
