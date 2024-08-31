def plural(single_item_str, count, suffix="s"):
    if count == 1:
        return single_item_str
    else:
        return single_item_str + suffix
