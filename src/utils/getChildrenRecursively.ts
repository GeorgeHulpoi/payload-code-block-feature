/**
 * https://github.com/facebook/lexical/blob/2c825792956f219f97da88c455d53855ddb1d9f5/packages/lexical/src/LexicalUtils.ts#L1554-L1571
 * Unfortunatly, it's not exported by lexical.
 */
import { $isElementNode, type LexicalNode } from 'lexical';

export function $getChildrenRecursively(node: LexicalNode): Array<LexicalNode> {
	const nodes = [];
	const stack = [node];
	while (stack.length > 0) {
		const currentNode = stack.pop();

		if (currentNode !== undefined) {
			if ($isElementNode(currentNode)) {
				stack.unshift(...currentNode.getChildren());
			}
			if (currentNode !== node) {
				nodes.push(currentNode);
			}
		}
	}
	return nodes;
}
