import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"


const Tab = ({value, title, children}: {
    value?: string,
    title?: string,
    children?: React.ReactNode
}) => {
    return (
        <Tabs defaultValue="account" className="">
            <TabsList>
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="password">Password</TabsTrigger>
            </TabsList>
            <TabsContent value="account">Make changes to your account here.</TabsContent>
        </Tabs>

    )
}

export default Tab