const PubSub = require('graphql-subscriptions').PubSub;
const parse = require('graphql').parse;
const getArgumentValues = require('graphql/execution/values').getArgumentValues;

function getSubscriptionDetails({ baseParams, schema }) {
  const parsedQuery = parse(baseParams.query);
  let args = {};
  // operationName is the name of the only root field in the subscription document
  let subscriptionName = '';
  parsedQuery.definitions.forEach((definition) => {
    if (definition.kind === 'OperationDefinition') {
      // only one root field is allowed on subscription.
      // No fragments for now.
      const rootField = (definition).selectionSet.selections[0];
      subscriptionName = rootField.name.value;
      const fields = schema.getSubscriptionType().getFields();
      args = getArgumentValues(
        fields[subscriptionName],
        rootField,
        baseParams.variables
      );
    }
  });

  return { args, subscriptionName };
}

const pubsub = new PubSub();

exports.module = {
  getSubscriptionDetails,
  pubsub
};
