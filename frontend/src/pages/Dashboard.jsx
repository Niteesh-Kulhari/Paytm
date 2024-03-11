import { AppBar } from "../components/Appbar";
import { BalanceComponent } from "../components/BalanceComponent";
import { Users } from "../components/Users";

export function Dashboard(){
    return<div>
        <AppBar/>
        <div className="m-8">
            <BalanceComponent value={"10,000"}/>
            <Users/>
        </div>
    </div>
}