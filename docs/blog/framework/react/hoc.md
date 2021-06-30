---
title: 高阶组件
date: 2021-04-04
tags: 
    - react
---

## 什么是高阶组件（HOC）
- 高阶组件是react中一种组件设计概念，普通组件将jsx转换为视图，高阶组件装饰组件生成新的组件。
- HOC目的是重用组件逻辑。
- HOC的具体实现为一个函数，传入具体组件，对其进行装饰，返回新的组件。
## 实现方式
- 属性代理
``` jsx
function proxyHoc(Comp){
   return class PH extends React.Component{
        render(){
          return <Comp/>
        }
   }
}
```
- 反向继承
``` jsx
function  inheritHoc(Comp){
      return class  IH extends Comp{
          render(){
                return super.render()
          }
      }
}
```
## 用法
``` jsx
class Test extends React.Component{
        render(){      
              return(
                    <div>test</div>
              )
        }
}

export default proxyHoc(Test);    //导出最终得到的组件
```
##  功能
-  条件渲染、组合渲染
    - 属性代理实现
    ``` jsx
      function proxyHoc(Comp){
         return class PH extends React.Component{
             render(){
                 return (
                     <div>
                          <p>我</p>
                          <Comp {...this.props}/>        
                    </div>
                 )
              }
         }
      }
      class Test extends React.Component{
          render(){
             return (
                 <p>是最{this.props.isGreat === true ? "棒" : "弱"}的</p>
             )  
         }
      }
   ```
- 操作props
  - 属性代理实现
  ``` jsx
  function proxyHoc(Comp){
      return class PH extends React.Component{
          render(){
              let newProps={...this.props,site:"全世界"}
                  return (
                      <div>
                          <p>我</p>
                          <Comp {...newProps}/>        
                      </div>
                  )
          }
      }
  }
  class Test extends React.Component{
      render(){
          return (
              <div>
                   <p>{this.props.site}</p>
                   <p>是最{this.props.isGreat === true ? "棒" : "弱"}的</p>
              </div>
          )
      }
  }
  ```
  - 反向继承实现
  ``` jsx
  function inheritHoc(Comp){
      return class IH extends Comp{
          render(){
              let CompRenderTree = super.render();
              let otherProps = {site:"全世界"};
              let newProps = Object.assign({},CompRenderTree.props,otherProps);
              let NewComp=React.cloneElement(CompRenderTree,newProps);

              return(
                  NewComp
              )
         }
     }
  }
  ```
 - 获取ref（没有搞懂）
      - 属性代理实现
      ``` jsx
      function proxyHoc(Comp){
          return class PH extends React.Component{

              componentDidMount(){
                  console.log(this.wrapperRef);
              }
              render(){
                  return <Comp ref={ref=> {this.wrapperRef=ref}}/>
              }
          }
      }
      ```
    - 反向继承实现
    ``` jsx
    function inheritHoc(Comp){
        return class IH extends Comp{
            componentDidMount(){
                console.log(this.wrapperRef);
            }
            render(){
                return (
                    super.render()
                ) 
            }
        }
   }

 
   class Test extends React.Component{

        wrapperRef=React.createRef("wrapperRef");
        render(){
            return (
                <div>
                     <p ref={this.wrapperRef}>Ref指向我</p>
                </div>
            ) 
        }
    }
    ```
  - 提取state
      - 属性代理实现简单的双向绑定
      ``` jsx
        function ppHOC(WrappedComponent) {
            return class PP extends React.Component {
                constructor(props) {
                    super(props)
                    this.state = {
                        name: ''
                    }  
      
                    this.onNameChange = this.onNameChange.bind(this)
                }
                onNameChange(event) {
                    this.setState({
                        name: event.target.value
                    })
                    console.log(this.state.name);
                }
                render() {
                    const newProps = {
                        name: {
                            value: this.state.name,
                            onChange: this.onNameChange
                        }
                    }
                    return <WrappedComponent {...this.props} {...newProps}/>
                }
           }
        }

        class Input extends React.Component{
            render(){
                return <input name="name" {...this.props.name} />
            }
        }
      ```
- 操作state
    - 反向继承可实现(仅该用于调试，避免弄乱内部组件state)
     ``` jsx
      function proxyHoc(WrappedComponent){
          return class II extends WrappedComponent {
              render() {
                  return (
                      <div>
                          <h2>HOC Debugger Component</h2>
                          <p>Props</p> <pre>{JSON.stringify(this.props, null, 2)}</pre>
                          <p>State</p><pre>{JSON.stringify(this.state, null, 2)}</pre>
                          {super.render()}
                     </div>
                  )
              }
         }
      }
     ```
## 来源
   *[code秘密花园](https://mp.weixin.qq.com/s/zhWs9NgjvM8Wy1vOVKKhHg)*
   *[https://www.html.cn/archives/9462](https://www.html.cn/archives/9462)*