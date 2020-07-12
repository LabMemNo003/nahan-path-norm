# nahan-path-norm

Path-Normalize middleware for nahan.

# Note

+ Path-Normalize middleware will check whether the path of a request url is normalized. If not, it will redirect the request to the normalized path.
+ This middleware should be used at the beginning of the application pipeline.

# Option

+ `continuous_slashes` : boolean = true  
  Check whether there are continuous slashes in requested path. If so, then replace them with single slash, and redirect to modified path.
+ `add_trailing_slash` : boolean = false
  Check whether there is a slash at the end of requested path. If not, then append a slash to the path, and redirect to modified path.
+ `del_trailing_slash` : boolean = false
  Check whether there is a slash at the end of requested path. If so, then remove all slashes at the end of the path, and redirect to modified path.
+ `res_status_code` : int = 302
  The response status code when redirect a request.

# Usage

``` javascript
const app =
    Pipeline(
        PathNorm({ del_trailing_slash = true }),
    );
```
