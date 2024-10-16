# Markdown Preview Enhanced

A super powerful markdown extension for **Visual Studio Code** with automatic scroll sync, math typesetting, and many more!

[TOC]

## Math typesetting

$ f(x) = sin(x) + 12 $

$$
u(x) =
  \begin{cases}
   \exp{x} & \text{if } x \geq 0 \\
   1       & \text{if } x < 0
  \end{cases}
$$

## Diagrams
### Mermaid

```mermaid
graph LR
  A --> B;
  B --> C;
```

### PlantUML

```puml
@startuml
<style>
class {
  MinimumWidth 100
  MaximumWidth 150
  Fontcolor red
}
</style>
class a
class "a long long long long long long long name" as A {
foo()
elt
a long long long long long long long name
}
@enduml
```

#### C4
```epigraph
Big design up front is dumb, but doing no design up front is even dumber.
--- Dave Thomas
```

##### Context
```puml
@startuml
!theme C4_brown from https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/themes
!include <c4/C4_Context.puml>  

'ref http://plantuml.com/stdlib
!include <office/Users/user.puml>
!include <office/Users/mobile_user.puml>

'LAYOUT_WITH_LEGEND
skinparam linetype poly
<style>
element {
  MinimumWidth 100
  MaximumWidth 500
  Fontcolor green
}

</style>
title System Context diagram for Internet Banking System

Person(customer  , Customer , "<$user> <$mobile_user>\n A customer of the bank, with personal bank accounts" )

AddSystemTag("color", $bgColor="#222",$fontColor="999")
System(banking_system, "Internet Banking System", "Allows customers to view information about their bank accounts, and make payments.",$tags="color")

System_Ext(mail_system, "E-mail system", "The internal Microsoft Exchange e-mail system.")
System_Ext(mainframe, "Mainframe Banking System", "Stores all of the core banking information about customers, accounts, transactions, etc.")

Rel(customer, banking_system, "Uses")
Rel_Back(customer, mail_system, "Sends e-mails to")
Rel_Neighbor(banking_system, mail_system, "Sends e-mails", "SMTP")
Rel(banking_system, mainframe, "Uses")
@enduml
```
##### Context with more detail
```puml
@startuml
!include <c4/C4_Context.puml>  

'ref http://plantuml.com/stdlib
!include <office/Users/user.puml>
!include <office/Users/mobile_user.puml>

'LAYOUT_TOP_DOWN
'LAYOUT_AS_SKETCH()
LAYOUT_WITH_LEGEND()
skinparam linetype ortho

title System Landscape diagram for Big Bank plc

Person(customer  , Customer , "<$user> <$mobile_user>\n A customer of the bank, with personal bank accounts" )

Enterprise_Boundary(c0, "Big Bank plc") {
    System(banking_system, "Internet Banking System", "Allows customers to view information about their bank accounts, and make payments.")

    System_Ext(atm, "ATM", "Allows customers to withdraw cash.")
    System_Ext(mail_system, "E-mail system", "The internal Microsoft Exchange e-mail system.")

    System_Ext(mainframe, "Mainframe Banking System", "Stores all of the core banking information about customers, accounts, transactions, etc.")

    Person_Ext(customer_service, "Customer Service Staff", "Customer service staff within the bank.")
    Person_Ext(back_office, "Back Office Staff", "Administration and support staff within the bank.")
}

Rel_Neighbor(customer, banking_system, "Uses")
Rel_R(customer, atm, "Withdraws cash using")
Rel_Back(customer, mail_system, "Sends e-mails to")

Rel_R(customer, customer_service, "Asks questions to", "Telephone")

Rel_D(banking_system, mail_system, "Sends e-mail using")
Rel_R(atm, mainframe, "Uses")
Rel_R(banking_system, mainframe, "Uses")
Rel_D(customer_service, mainframe, "Uses")
Rel_U(back_office, mainframe, "Uses")

Lay_D(atm, banking_system)

Lay_D(atm, customer)
Lay_U(mail_system, customer)
@enduml
```

##### Container
```puml
@startuml
'!includeurl https://raw.githubusercontent.com/RicardoNiepel/C4-PlantUML/master/C4_Container.puml
!include <c4/C4_Container.puml>  

'ref http://plantuml.com/stdlib
!include <office/Users/user.puml>
!include <office/Users/mobile_user.puml>

LAYOUT_WITH_LEGEND()
skinparam linetype ortho

title Container diagram for Internet Banking System

Person(customer  , Customer , "<$user> <$mobile_user>\n A customer of the bank, with personal bank accounts" )

System_Boundary(c1, "Internet Banking") {
    Container(web_app, "Web Application", "Java, Spring MVC", "Delivers the static content and the Internet banking SPA")
    Container(spa, "Single-Page App", "JavaScript, Angular", "Provides all the Internet banking functionality to cutomers via their web browser")
    Container(mobile_app, "Mobile App", "C#, Xamarin", "Provides a limited subset of the Internet banking functionality to customers via their mobile device")
    ContainerDb(database, "Database", "SQL Database", "Stores user registraion information, hased auth credentials, access logs, etc.")
    Container(backend_api, "API Application", "Java, Docker Container", "Provides Internet banking functionality via API")
}

System_Ext(email_system, "E-Mail System", "The internal Microsoft Exchange system")
System_Ext(banking_system, "Mainframe Banking System", "Stores all of the core banking information about customers, accounts, transactions, etc.")

Rel(customer, web_app, "Uses", "HTTPS")
Rel(customer, spa, "Uses", "HTTPS")
Rel(customer, mobile_app, "Uses")

Rel_Neighbor(web_app, spa, "Delivers")
Rel(spa, backend_api, "Uses", "async, JSON/HTTPS")
Rel(mobile_app, backend_api, "Uses", "async, JSON/HTTPS")
Rel_Back_Neighbor(database, backend_api, "Reads from and writes to", "sync, JDBC")

Rel_Back(customer, email_system, "Sends e-mails to")
Rel_Back(email_system, backend_api, "Sends e-mails using", "sync, SMTP")
Rel_Neighbor(backend_api, banking_system, "Uses", "sync/async, XML/HTTPS")

@enduml
```

##### Components
```puml
@startuml

'!includeurl https://raw.githubusercontent.com/RicardoNiepel/C4-PlantUML/master/C4_Component.puml
!include <c4/C4_Component.puml>  


LAYOUT_WITH_LEGEND()


title Component diagram for Internet Banking System - API Application

Container(spa, "Single Page Application", "javascript and angular", "Provides all the internet banking functionality to customers via their web browser.")
Container(ma, "Mobile App", "Xamarin", "Provides a limited subset ot the internet banking functionality to customers via their mobile mobile device.")
ContainerDb(db, "Database", "Relational Database Schema", "Stores user registration information, hashed authentication credentials, access logs, etc.")
System_Ext(mbs, "Mainframe Banking System", "Stores all of the core banking information about customers, accounts, transactions, etc.")

Container_Boundary(api, "API Application") {
    Component(sign, "Sign In Controller", "MVC Rest Controlle", "Allows users to sign in to the internet banking system")
    Component(accounts, "Accounts Summary Controller", "MVC Rest Controlle", "Provides customers with a summory of their bank accounts")
    Component(security, "Security Component", "Spring Bean", "Provides functionality related to singing in, changing passwords, etc.")
    Component(mbsfacade, "Mainframe Banking System Facade", "Spring Bean", "A facade onto the mainframe banking system.")

    Rel(sign, security, "Uses")
    Rel(accounts, mbsfacade, "Uses")
    Rel(security, db, "Read & write to", "JDBC")
    Rel(mbsfacade, mbs, "Uses", "XML/HTTPS")
}

Rel(spa, sign, "Uses", "JSON/HTTPS")
Rel(spa, accounts, "Uses", "JSON/HTTPS")

Rel(ma, sign, "Uses", "JSON/HTTPS")
Rel(ma, accounts, "Uses", "JSON/HTTPS")
@enduml
```
### GraphicViz
### Basic

```viz
digraph G {
  A -> B;
}
```

## Code Chunk

### GNUPlot

```gnuplot {cmd=true output="html"}
set terminal svg
set title "Simple Plots" font ",20"
set key left box
set samples 50
set style data points

plot [-10:10] sin(x),atan(x),cos(atan(x))
```
### LaTeX

> Branched Ring

```latex {cmd, latex_zoom=2}
\documentclass{standalone}
\usepackage[utf8]{inputenc}
\usepackage[english]{babel}

\usepackage{chemfig}
\begin{document}
\vspace{.5cm}

\chemfig{A*6(-B=C(-CH_3)-D-E-F(=G)=)}

\end{document}
```

```latex {cmd,latex_width=800}
\documentclass{standalone}
\usepackage[european, RPvoltages, straightvoltages]{circuitikz}
\usepackage{siunitx}
\usepackage{ifthen}
\newboolean{showmeters}
\newcommand{\mybigsubcircuit}{%
    \draw (0,0) to[R=$R$, *-] ++(3,0) coordinate(a);
    \ifthenelse{\boolean{showmeters}}
    {\draw (a) to[rmeterwa, color=red] ++(2,0) coordinate(b);}
    {\draw (a) to[short] ++(2,0) coordinate(b);}
    \draw (b) to[short, -o] ++(1,0);
}
\begin{document}

\setboolean{showmeters}{false}
\begin{circuitikz}
    \mybigsubcircuit
\end{circuitikz}

\setboolean{showmeters}{true}
\begin{circuitikz}
    \mybigsubcircuit
\end{circuitikz}

\end{document}
```