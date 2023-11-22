import isShopAvailable from "@/utils/middleware/isShopAvailable";
import {
  Button,
  Card,
  HorizontalStack,
  Layout,
  Page,
  Text,
  VerticalStack,
} from "@shopify/polaris";
import { ExternalMinor } from "@shopify/polaris-icons";
import { useRouter } from "next/router";

//On first install, check if the store is installed and redirect accordingly
export async function getServerSideProps(context) {
  return await isShopAvailable(context);
}

const HomePage = () => {
  const router = useRouter();

  return (
    <>
      <Page title="Home">
        <Layout>
          {/* <Layout.Section fullWidth>
            <Card>
              <VerticalStack gap="2">
                <Text as="h2" variant="headingMd">
                  Debug Cards
                </Text>
                <Text>
                  Explore how the repository handles data fetching from the
                  backend, App Proxy, making GraphQL requests, Billing API and
                  more.
                </Text>
                <HorizontalStack wrap={false} align="end">
                  <Button
                    primary
                    onClick={() => {
                      router.push("/debug");
                    }}
                  >
                    Debug Cards
                  </Button>
                </HorizontalStack>
              </VerticalStack>
            </Card>
          </Layout.Section> */}
          <Layout.Section oneHalf>
            <Card>
              <VerticalStack gap="2">
                <Text as="h2" variant="headingMd">
                  All Pairs
                </Text>
                <Text>
                  Showing all pairs which stored in database.
                </Text>
                <HorizontalStack wrap={false} align="end">
                  <Button
                    primary
                    external
                    icon={ExternalMinor}
                    onClick={() => {router.push('/debug/data')}}
                  >
                    Explore
                  </Button>
                </HorizontalStack>
              </VerticalStack>
            </Card>
          </Layout.Section>
          <Layout.Section oneHalf>
            <Card>
              <VerticalStack gap="2">
                <Text as="h2" variant="headingMd">
                  Create Pair
                </Text>
                <Text>
                  Create new pair
                </Text>
                <HorizontalStack wrap={false} align="end" gap="2">
                
                  <Button
                    external
                    primary
                    icon={ExternalMinor}
                    onClick={() => {router.push('/debug/pairs/create')}}
                   
                  >
                    Add New
                  </Button>
                </HorizontalStack>
              </VerticalStack>
            </Card>
          </Layout.Section>
          {/* <Layout.Section oneHalf>
            <Card>
              <VerticalStack gap="2">
                <Text as="h2" variant="headingMd">
                  Course
                </Text>
                <Text>
                  [BETA] I'm building course as a live service on How To Build
                  Shopify Apps
                </Text>
                <HorizontalStack wrap={false} align="end">
                  <Button
                    external
                    primary
                    icon={ExternalMinor}
                    onClick={() => {
                      open(
                        "https://kinngh.gumroad.com/l/how-to-make-shopify-apps?utm_source=boilerplate&utm_medium=nextjs",
                        "_blank"
                      );
                    }}
                  >
                    Buy
                  </Button>
                </HorizontalStack>
              </VerticalStack>
            </Card>
          </Layout.Section> */}
          {/* <Layout.Section oneHalf />*/}
        </Layout> 
      </Page>
    </>
  );
};

export default HomePage;
