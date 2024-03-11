import { BottomWarning } from "../components/BottomWarning";
import { Button } from "../components/Button";
import { Heading } from "../components/Heading";
import { InputBox } from "../components/InputBox";
import { SubHeading } from "../components/SubHeading";

 export function SignIn(){
    return <div className="bg-slate-300 h-screen flex justify-center">
        <div className="flex flex-col justify-center">
            <div className="rounded-lg bg-white w-80 p-2 px-4 text-center h-max">
                <Heading label={"Sign In"}/>
                <SubHeading label={"Enter your credentials to access your account"}/>
                <InputBox placeholder={"John@gmail.com"} label={"Email"}/>
                <InputBox placeholder={"*******"} label={"Password"}/>
                <div className="pt-4">
                    <Button label={"Sign In"}/>
                </div>
                <BottomWarning label={"Don't have an account?"} buttonText={"Sign Up"} to={"/signup"}/>
            </div>
        </div>

    </div>
 }