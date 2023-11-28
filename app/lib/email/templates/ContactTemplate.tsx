import { Html } from "@react-email/html";
import { Text } from "@react-email/text";
import { Section } from "@react-email/section";
import { Container } from "@react-email/container";
import type { ContactData } from "@/components/website/types";

export function ContactEmail(props: ContactData) {
  return (
    <Html>
      <Section style={main}>
        <Container style={container}>
          <Text style={heading}>Hi there!</Text>
          <Text style={paragraph}>
            Someone submitted contact info at https://resumerunner.ai
          </Text>
          <Text style={paragraph}>
            <strong>First name: </strong>
            {props.firstName}
          </Text>
          <Text style={paragraph}>
            <strong>Last name: </strong>
            {props.lastName}
          </Text>
          <Text style={paragraph}>
            <strong>Email: </strong>
            <a href={`mailto:${props.email}`}>{props.email}</a>
          </Text>
          <Text style={paragraph}>
            <strong>Company: </strong>
            {props.company}
          </Text>
          <Text style={paragraph}>
            <strong>Message: </strong>
            {props.message}
          </Text>
        </Container>
      </Section>
    </Html>
  );
}

// Styles for the email template
const main = {
  backgroundColor: "#ffffff",
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  width: "580px",
};

const heading = {
  fontSize: "32px",
  lineHeight: "1.3",
  fontWeight: "700",
  color: "#484848",
};

const paragraph = {
  fontSize: "18px",
  lineHeight: "1.4",
  color: "#484848",
};
