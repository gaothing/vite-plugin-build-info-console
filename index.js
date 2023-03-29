
const  fs =require('fs') ;
const path =require('path') ;

module.exports= (options) => {
  const  output  = options?.output;
  let env;
  return {
    name:'vite-plugin-build-info-console',
    config(_, { command }) {
      env = command;
    },
    transformIndexHtml(result) {
      console.log({ env })
      if (env!=="serve") {
        
      const dateString = new Date().toLocaleString();
      const windowConf = `window.__APP__CONFIG__`;
      const configStr = `${windowConf}=${JSON.stringify(options??{output:'dist'})};
      Object.freeze(${windowConf});
      Object.defineProperty(window, "__APP__CONFIG__", {
        configurable: false,
        writable: false,
      });
      console.log('%c 项目构建时间:','color:red');
      console.log('%c ${dateString}','color:#1D63F2');
    `.replace(/\s/g, '');
      fs.writeFileSync(getRootPath(`${output??'dist'}/__app__config__.js`), configStr);
      result = result.replace(/<\/html>/, `<script src="./__app__config__.js?${dateString}"></script>\n</html>`);
      }
        
      return result;
    }
  }
};
/**
 * Get user root directory
 * @param dir file path
 */
  function getRootPath(...dir) {
  return path.resolve(process.cwd(), ...dir);
}

