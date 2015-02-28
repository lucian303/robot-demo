(function ($) {
    'use strict';

    var blocks = [], // hold the block stacks
        WORLD_SIZE = 10;

    /**
     * Draw / redraw the representation of the current state
     */
    function showBlocks() {
        var index,
            stackIndex,
            stackHtml,
            maxStackLength = 1,// store these so we can pad blocks so that the stack grows up, not down
            tmpStackLength,
            currentLength,
            paddingBlockIndex,
            stackSelector;

        for (index = 0; index < WORLD_SIZE; index++) {
            // Clear each block
            if (blocks[index].length) {
                stackHtml = '';
            } else {
                stackHtml = '<span class="stack">&nbsp;</span>'; // show empty block
            }

            // Draw each block
            tmpStackLength = 0;
            for (stackIndex = blocks[index].length - 1; stackIndex >= 0; stackIndex--) {
                stackHtml += '<span class="block">' + blocks[index][stackIndex] + '</span>';
                tmpStackLength++;
            }
            $('#stack-' + index).html(stackHtml);

            if (tmpStackLength > maxStackLength) {
                maxStackLength = tmpStackLength;
            }
        }

        // Adjust each block with empty blocks above so the stack grows up, not down
        for (index = 0; index < WORLD_SIZE; index++) {
            currentLength = $('#stack-' + index + ' .block').length;
            for (paddingBlockIndex = currentLength; paddingBlockIndex < maxStackLength; paddingBlockIndex++) {
                stackSelector = $('#stack-' + index);
                stackSelector.html('<span class="empty-block">&nbsp;</span>' + stackSelector.html());
            }
        }
    }

    /**
     * Initialize all the stacks
     */
    function init() {
        var index;

        for (index = 0; index < WORLD_SIZE; index++) {
            blocks[index] = [index];
            $('#output').append('<span class="stack" id="stack-' + index + '"></span>');
        }

        showBlocks();
    }

    /**
     * Get the stack index of the block number provided
     *
     * @param {Number} block
     */
    function getStack(block) {
        var index,
            stackIndex;

        for (index = 0; index < WORLD_SIZE; index++) {
            for (stackIndex = blocks[index].length - 1; stackIndex >= 0; stackIndex--) {
                if (blocks[index][stackIndex] === Number(block)) {
                    return Number(index);
                }
            }
        }
    }

    /**
     * Perform the move
     *
     * @param {Number} source
     * @param {Number} destination
     */
    function move(source, destination) {
        var sourceStack,
            destinationStack,
            stackIndex,
            tmp;

        // convert to number so we can use ===
        source = Number(source);
        destination = Number(destination);

        if (source === destination) {
            return; // illegal command since source and destination are the same
        }

        sourceStack = getStack(source);
        destinationStack = getStack(destination);
        if (sourceStack === destinationStack) {
            return; // illegal command since source and destination are in the same stack
        }

        // clear source stack
        for (stackIndex = blocks[sourceStack].length - 1; stackIndex >= 0; stackIndex--) {
            if (blocks[sourceStack][stackIndex] !== source) {
                tmp = blocks[sourceStack].pop();
                blocks[tmp].push(tmp);
            } else {
                break;
            }
        }

        // clear destination stack
        for (stackIndex = blocks[destinationStack].length - 1; stackIndex >= 0; stackIndex--) {
            if (blocks[destinationStack][stackIndex] !== destination) {
                tmp = blocks[destinationStack].pop();
                blocks[tmp].push(tmp);
            } else {
                break;
            }
        }

        // move block
        tmp = blocks[sourceStack].pop();
        blocks[destinationStack].push(tmp);

        showBlocks();
    }

    /**
     * Interpret the command and run it
     *
     * @param {String} command
     */
    function runCommand(command) {
        var regex = /move (\d) onto (\d)/ig,
            match = regex.exec(command),
            source = match[1],
            destination = match[2];

        move(source, destination);
    }

    // Run the robot
    init();
    runCommand('move 1 onto 2');
    runCommand('move 5 onto 1');
    runCommand('move 9 onto 5');
    runCommand('move 8 onto 9');
    runCommand('move 6 onto 1');
    runCommand('move 2 onto 4');
}(jQuery));
