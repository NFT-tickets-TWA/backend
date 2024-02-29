create or replace function check_if_registration_opened()
    returns trigger as
$$
begin
    if exists(select * from "Event" where id = NEW."eventID") then
        if exists(select * from "Event" where id = NEW."eventID" and status = 'REGISTRATION_OPENED') then
            if exists(select * from "Event" where id = NEW."eventID" and "finishedAt" > now()) then
                raise EXCEPTION 'can not register because of the event is finished';
            else
                return new;
            end if;
        else
            raise EXCEPTION 'registration must be opened if you want to register';
        end if;
    else
        raise EXCEPTION 'there is no event with this id';
    end if;
end
$$
    language "plpgsql";

create or replace function check_before_approve()
    returns trigger as
$$
begin
    if NEW.status = 'REGISTERED' then
        if (select "registrationFinishedAt" from "Event" where id = NEW."eventID") >= now() then
            return NEW;
        else
            raise EXCEPTION 'registration already finished';
        end if;
    else
        if NEW.status = 'APPROVED' then
            if OLD.status = 'REGISTERED' then
                if (select "finishedAt" from "Event" where id = NEW."eventID") >= now() then
                    return NEW;
                else
                    raise EXCEPTION 'event already finished';
                end if;
            else
                raise EXCEPTION 'user not registered';
            end if;
        else
            if NEW.status = 'RECEIVED_NFT' then
                if OLD.status = 'APPROVED' then
                    return NEW;
                else
                    raise EXCEPTION 'user not approved';
                end if;
            end if;
        end if;
        return NEW;
    end if;
end
$$
    language 'plpgsql';


create or replace function event_update_at()
    returns trigger as
$$
begin
    new."updatedAt" = 'now()';
    RETURN NEW;
end;
$$
    language 'plpgsql';
create or replace function event_registration_finished_at()
    returns trigger as
$$
begin
    if new."registrationFinishedAt" is not null then
        if new."registrationFinishedAt" > new."finishedAt" then
            RAISE EXCEPTION 'registration must be finished earlier than event is finished';
        else
            RETURN NEW;
        end if;

    else
        new."registrationFinishedAt" = new."finishedAt";
        return new;
    end if;
end;
$$
    language 'plpgsql';
CREATE OR REPLACE FUNCTION check_before_create_location()
    RETURNS TRIGGER AS
$$
BEGIN
    IF new."isOffline" = true THEN
        IF new.link IS NULL AND new.address IS NOT NULL THEN
            RETURN NEW;
        ELSE
            RAISE EXCEPTION 'If event is offline, link must be null and address must be not null';
        END IF;
    ELSE
        IF new.address IS NULL AND new.link IS NOT NULL THEN
            RETURN NEW;
        ELSE
            RAISE EXCEPTION 'If event is not offline, link must be not null and address must not null';
        END IF;
    END IF;
END;
$$ LANGUAGE plpgsql;
CREATE or replace TRIGGER check_before_create_location_trigger
    BEFORE INSERT OR UPDATE
    ON "Location"
    FOR EACH ROW
EXECUTE FUNCTION check_before_create_location();

create
    or replace trigger check_change_status
    before
        update
    on "ParticipantList"
    for each row
execute function
    check_before_approve();
create
    or replace trigger event_update_at
    before
        update
    on "Event"
    for each row
execute function
    event_update_at();
create
    or replace trigger event_registration
    before
        insert
    on "Event"
    for each row
execute function
    event_registration_finished_at();

create
    or replace trigger check_is_registration_opened
    before
        insert
    on "ParticipantList"
    for each row
execute function
    check_if_registration_opened();
