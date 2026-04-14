import { Card, Container, Flex, Grid, Heading, Section, Text } from "@radix-ui/themes";

import { LinkButton } from "@/components/ui/link-button";
import { getHomeLinks } from "@/features/home/server/get-home-links";

export async function HomeContent() {
  const links = await getHomeLinks();

  return (
    <Section size="2" pt="4">
      <Container size="4" pb="8">
        <Card size="3" className="rounded-3xl">
          <Flex direction="column" gap="3">
            <Heading as="h2" size="6">
              Project foundation
            </Heading>
            <Text as="p" size="3" color="gray">
              This route uses a feature module entrypoint and shared UI layer, ready for scale.
            </Text>

            <Grid columns={{ initial: "1", sm: "2" }} gap="3" pt="2">
              {links.map((link) => (
                <LinkButton
                  key={link.href}
                  href={link.href}
                  label={link.label}
                  external={link.external}
                />
              ))}
            </Grid>
          </Flex>
        </Card>
      </Container>
    </Section>
  );
}
