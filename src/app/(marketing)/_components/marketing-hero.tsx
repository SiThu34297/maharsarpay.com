import { Box, Container, Heading, Section, Text } from "@radix-ui/themes";

export function MarketingHero() {
  return (
    <Section size="2" pb="0">
      <Container size="4">
        <Box className="rounded-3xl bg-zinc-950 px-8 py-12 text-zinc-100 dark:bg-zinc-800">
          <Text as="p" size="2" weight="medium" className="uppercase tracking-wide text-zinc-300">
            Mahar Sar Pay
          </Text>
          <Heading as="h1" size="8" className="mt-4 leading-tight text-zinc-100">
            Maintainable Next.js 16 starting point
          </Heading>
          <Text as="p" size="4" className="mt-4 max-w-2xl text-zinc-300">
            Route grouping, private route internals, shared layers, and feature entrypoints are
            wired and ready.
          </Text>
        </Box>
      </Container>
    </Section>
  );
}
